<script setup lang="ts">
definePageMeta({
  middleware: ["teacher"],
  // or middleware: 'auth'
})

const router = useRouter()
const solutionStore = useSolutions()

let solutions = ref<any>([])

let res = await solutionStore.getAll()

if (res.status.value == "success") {
  solutions.value = res.data.value
}

function getPrettyDate(dateStr: string) {
  let res = new Date(dateStr)

  return (
    res.toLocaleDateString("ru-RU", {
      month: "long",
      day: "numeric",
    }) +
    ", " +
    res.toLocaleTimeString("ru-RU", {
      minute: "2-digit",
      hour: "2-digit",
    })
  )
}
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BackButton />
      </v-col>
      <v-col cols="12">
        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Урок</th>
              <!-- <th class="text-left">
          Имя
        </th> -->
              <th class="text-left">Дата</th>
              <th class="text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(solution, index) in solutions"
              :key="solution.name"
              @click="router.push(`/teacher/solution?_id=${solution._id}`)"
              class="cursor-pointer"
            >
              <td>{{ solution.lesson.name }}</td>
              <!-- <td>{{ solution.notes }}</td> -->
              <td>{{ getPrettyDate(solution.date) }}</td>
              <td>
                <p v-if="solution.status == 'checked'" class="primary">Принято</p>
                <p v-if="solution.status == 'not_checked'">Не проверено</p>
                <p v-if="solution.status == 'declined'" class="error">Отказано</p>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.error {
  color: red !important;
  font-weight: 500;
}
.primary {
  color: green !important;
  font-weight: 500;
}
</style>
