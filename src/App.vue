<script>
export default {
  data() {
    return {
      tasks: [
        { id: 1, text: 'Aprender Vue.js', completed: false },
        { id: 2, text: 'Crear mi primera app', completed: false }
      ],
      newTask: ''
    }
  },
  computed: {
    activeTasks() {
      return this.tasks.filter(t => !t.completed).length
    }
  },
  methods: {
    addTask() {
      if (this.newTask.trim()) {
        this.tasks.push({
          id: Date.now(),
          text: this.newTask,
          completed: false
        })
        this.newTask = ''
      }
    },
    toggleTask(id) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.completed = !task.completed
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
    }
  }
}
</script>

<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #e9d5ff, #dbeafe); padding: 2rem;">
    <div style="max-width: 42rem; margin: 0 auto;">
      <div style="background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #9333ea, #2563eb); padding: 2rem; color: white;">
          <h1 style="font-size: 2.25rem; font-weight: bold; margin-bottom: 0.5rem;">📝 Mis Tareas</h1>
          <p style="color: #e9d5ff;">
            {{ activeTasks }} {{ activeTasks === 1 ? 'tarea pendiente' : 'tareas pendientes' }}
          </p>
        </div>

        <!-- Input -->
        <div style="padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; gap: 0.75rem;">
            <input
              v-model="newTask"
              @keyup.enter="addTask"
              placeholder="Agregar nueva tarea..."
              style="flex: 1; padding: 0.75rem 1rem; border: 2px solid #d1d5db; border-radius: 0.5rem; outline: none;"
            />
            <button
              @click="addTask"
              style="background: #9333ea; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 600;"
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <!-- Task List -->
        <div style="padding: 1.5rem;">
          <div v-if="tasks.length === 0" style="text-align: center; padding: 3rem; color: #9ca3af;">
            <p style="font-size: 1.25rem;">No hay tareas todavía</p>
            <p style="font-size: 0.875rem; margin-top: 0.5rem;">¡Agrega tu primera tarea arriba!</p>
          </div>
          
          <ul v-else style="list-style: none; padding: 0; margin: 0;">
            <li
              v-for="task in tasks"
              :key="task.id"
              style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #f9fafb; border-radius: 0.5rem; margin-bottom: 0.75rem;"
            >
              <button
                @click="toggleTask(task.id)"
                style="border: none; background: none; cursor: pointer; font-size: 1.5rem;"
              >
                {{ task.completed ? '✅' : '⭕' }}
              </button>
              
              <span :style="{ flex: 1, fontSize: '1.125rem', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#9ca3af' : '#1f2937' }">
                {{ task.text }}
              </span>
              
              <button
                @click="deleteTask(task.id)"
                style="border: none; background: none; color: #ef4444; cursor: pointer; font-size: 1.25rem;"
              >
                🗑️
              </button>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div v-if="tasks.length > 0" style="background: #f9fafb; padding: 1rem; text-align: center; font-size: 0.875rem; color: #6b7280; border-top: 1px solid #e5e7eb;">
          Total: {{ tasks.length }} {{ tasks.length === 1 ? 'tarea' : 'tareas' }} | 
          Completadas: {{ tasks.filter(t => t.completed).length }}
        </div>
      </div>

      <!-- Info Box -->
      <div style="margin-top: 1.5rem; background: white; border-radius: 0.5rem; padding: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
        <h3 style="font-weight: bold; color: #1f2937; margin-bottom: 0.5rem;">💡 Características:</h3>
        <ul style="font-size: 0.875rem; color: #6b7280; list-style: none; padding: 0;">
          <li>✅ Agregar tareas nuevas</li>
          <li>✅ Marcar tareas como completadas</li>
          <li>✅ Eliminar tareas</li>
          <li>✅ Contador de tareas pendientes</li>
        </ul>
      </div>
    </div>
  </div>
</template>