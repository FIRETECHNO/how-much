<script setup lang="ts">
const input = ref<HTMLInputElement | null>(null);
const fileObj = ref<File | null>(null);
const progress = ref(0);
const uploading = ref(false);

const PART_SIZE = 10 * 1024 * 1024; // 10 MB
const CONCURRENCY = 3;

function prettyBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(2)} ${units[i]}`;
}

function onFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const f = target.files && target.files[0];
  if (f) fileObj.value = f;
}

let controller = new AbortController();

async function startUpload() {
  if (!fileObj.value) return;
  uploading.value = true;
  progress.value = 0;

  // 1) init
  const initRes = await fetch('/api/upload/initiate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fileName: fileObj.value.name, contentType: fileObj.value.type }),
  }).then(r => r.json());

  if (!initRes.UploadId) {
    console.error('init failed', initRes);
    uploading.value = false;
    return;
  }

  const UploadId = initRes.UploadId as string;
  const Key = initRes.Key as string;

  // 2) prepare parts
  const size = fileObj.value.size;
  const parts: { number: number; start: number; end: number; uploaded?: boolean; etag?: string }[] = [];
  let partNumber = 1;
  for (let start = 0; start < size; start += PART_SIZE) {
    const end = Math.min(start + PART_SIZE, size);
    parts.push({ number: partNumber, start, end });
    partNumber++;
  }

  // concurrency pool
  let uploadedBytes = 0;

  async function uploadPart(part: any) {
    // get signed url
    const q = new URL('/api/upload/sign', location.origin);
    q.searchParams.set('Key', Key);
    q.searchParams.set('UploadId', UploadId);
    q.searchParams.set('PartNumber', String(part.number));

    const signRes = await fetch(q.toString()).then(r => r.json());
    const url = signRes.url;
    if (!url) throw new Error('no presigned url');

    const blob = fileObj.value!.slice(part.start, part.end);

    // upload via PUT
    const r = await fetch(url, {
      method: 'PUT',
      body: blob,
      signal: controller.signal,
    });

    if (!r.ok) throw new Error('upload part failed: ' + r.status);

    // ETag header should be present
    const etag = r.headers.get('ETag') || r.headers.get('etag');
    part.uploaded = true;
    part.etag = etag;

    uploadedBytes += (part.end - part.start);
    progress.value = (uploadedBytes / size) * 100;
  }

  // run with limited concurrency
  const queue = parts.slice();
  const workers = new Array(CONCURRENCY).fill(null).map(async () => {
    while (queue.length) {
      const p = queue.shift();
      if (!p) break;
      try {
        await uploadPart(p);
      } catch (err) {
        console.error('part upload error', err);
        throw err;
      }
    }
  });

  try {
    await Promise.all(workers);
  } catch (err) {
    console.error('Upload failed, aborting');
    uploading.value = false;
    return;
  }

  // collect parts for completion (must be sorted by PartNumber)
  const completedParts = parts.map(p => ({ ETag: p.etag, PartNumber: p.number }));

  // 3) complete
  const compRes = await fetch('/api/upload/complete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ Key, UploadId, Parts: completedParts }),
  }).then(r => r.json());

  console.log('complete result', compRes);
  progress.value = 100;
  uploading.value = false;
}

function abortUpload() {
  controller.abort();
  controller = new AbortController();
  uploading.value = false;
}
</script>


<template>
  <div class="uploader">
    <input ref="input" type="file" accept="video/*" @change="onFile" />

    <div v-if="fileObj">
      <p>{{ fileObj.name }} — {{ prettyBytes(fileObj.size) }}</p>

      <div class="progress">
        <div class="bar" :style="`width: ${progress}%`">{{ Math.round(progress) }}%</div>
      </div>

      <button @click="startUpload" :disabled="uploading">Start upload</button>
      <button @click="abortUpload" v-if="uploading">Abort</button>
    </div>
  </div>
</template>
<style scoped>
.uploader {
  max-width: 640px;
  margin: 12px;
}

.progress {
  background: #eee;
  height: 20px;
  border-radius: 6px;
  overflow: hidden;
  margin: 8px 0
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  color: #fff;
  padding-left: 8px;
  display: flex;
  align-items: center
}
</style>