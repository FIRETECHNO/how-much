<script setup lang="ts">
const fileObj = ref<File | null>(null);
const progress = ref(0);
const uploading = ref(false);

const PART_SIZE = 5 * 1024 * 1024; // 10 MB
const CONCURRENCY = 3;

const emit = defineEmits(["upload-finished"])

function prettyBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
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

  const initRes = await fetch('/api/upload/initiate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fileName: fileObj.value.name, contentType: fileObj.value.type }),
  }).then(r => r.json());

  if (!initRes.UploadId) {
    console.error('Ошибка инициализации', initRes);
    uploading.value = false;
    return;
  }

  const UploadId = initRes.UploadId as string;
  const Key = initRes.Key as string;

  const size = fileObj.value.size;
  const parts: { number: number; start: number; end: number; uploaded?: boolean; etag?: string }[] = [];
  let partNumber = 1;
  for (let start = 0; start < size; start += PART_SIZE) {
    const end = Math.min(start + PART_SIZE, size);
    parts.push({ number: partNumber, start, end });
    partNumber++;
  }

  let uploadedBytes = 0;

  async function uploadPart(part: any) {
    const q = new URL('/api/upload/sign', location.origin);
    q.searchParams.set('Key', Key);
    q.searchParams.set('UploadId', UploadId);
    q.searchParams.set('PartNumber', String(part.number));

    const signRes = await fetch(q.toString()).then(r => r.json());
    const url = signRes.url;
    if (!url) throw new Error('Не удалось получить presigned URL');

    const blob = fileObj.value!.slice(part.start, part.end);

    const r = await fetch(url, {
      method: 'PUT',
      body: blob,
      signal: controller.signal,
    });

    if (!r.ok) throw new Error('Ошибка загрузки части: ' + r.status);

    const etag = r.headers.get('ETag') || r.headers.get('etag');
    part.uploaded = true;
    part.etag = etag;

    uploadedBytes += (part.end - part.start);
    progress.value = (uploadedBytes / size) * 100;
  }

  const queue = parts.slice();
  const workers = new Array(CONCURRENCY).fill(null).map(async () => {
    while (queue.length) {
      const p = queue.shift();
      if (!p) break;
      try {
        await uploadPart(p);
      } catch (err) {
        console.error('Ошибка при загрузке части', err);
        throw err;
      }
    }
  });

  try {
    await Promise.all(workers);
  } catch (err) {
    console.error('Загрузка не удалась, отмена');
    uploading.value = false;
    return;
  }

  const completedParts = parts.map(p => ({ ETag: p.etag, PartNumber: p.number }));

  const compRes = await fetch('/api/upload/complete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ Key, UploadId, Parts: completedParts }),
  }).then(r => r.json());

  emit("upload-finished", compRes.Location)

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
  <div>
    <v-file-input v-if="!fileObj" label="Выберите видеофайл" accept="video/*" variant="outlined" density="compact"
      @change="onFile" hide-details></v-file-input>

    <div v-if="fileObj">
      <p class="text-caption font-weight-medium">{{ fileObj.name }} — {{ prettyBytes(fileObj.size) }}</p>

      <v-progress-linear v-if="progress < 100" v-model="progress" :indeterminate="uploading"
        :color="uploading && progress < 100 ? 'success' : 'grey'" height="20" rounded class="my-2">
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>

      <v-btn v-if="!uploading && progress < 100" @click="startUpload" :disabled="uploading" color="success"
        variant="tonal" size="large" prepend-icon="mdi-upload-outline">
        Начать загрузку
      </v-btn>
      <v-btn v-if="uploading" @click="abortUpload" color="error" variant="tonal" size="small">
        Отменить
      </v-btn>
      <v-chip v-if="progress === 100" color="success" variant="flat" size="small">
        Загрузка завершена
      </v-chip>
    </div>
  </div>
</template>