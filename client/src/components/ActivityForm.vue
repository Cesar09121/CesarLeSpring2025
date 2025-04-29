<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label">Activity Type</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="form.type" required>
            <option value="">Select activity type</option>
            <option value="Run">Run</option>
            <option value="Walk">Walk</option>
            <option value="Cycle">Cycle</option>
            <option value="Swim">Swim</option>
            <option value="Hike">Hike</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Distance</label>
          <div class="control">
            <input
              class="input"
              type="number"
              v-model="form.distance"
              step="0.01"
              min="0"
              required
            >
          </div>
        </div>
      </div>
      
      <div class="column">
        <div class="field">
          <label class="label">Unit</label>
          <div class="control">
            <div class="select is-fullwidth"> 
              <select v-model="form.distanceUnit" required>
                <option value="mi">Miles</option>
                <option value="km">Kilometers</option>
                <option value="m">Meters</option>
                <option value="ft">Feet</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="field">
      <label class="label">Duration (minutes)</label>
      <div class="control">
        <input
          class="input"
          type="number"
          v-model="form.duration"
          min="1"
          required
        >
      </div>
    </div>
    
    <div class="field">
      <label class="label">Date</label>
      <div class="control">
        <input
          class="input"
          type="date"
          v-model="form.date"
          required
        >
      </div>
    </div>
    
    <div class="field">
      <label class="label">Location</label>
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label is-small">Latitude</label>
            <div class="control">
              <input
                class="input"
                type="number"
                v-model="form.location.lat"
                step="0.0000001"
                required
              >
            </div>
          </div>
        </div>
        
        <div class="column">
          <div class="field">
            <label class="label is-small">Longitude</label>
            <div class="control">
              <input
                class="input"
                type="number"
                v-model="form.location.lng"
                step="0.0000001"
                required
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="field is-grouped mt-4">
      <div class="control" :class="{ 'is-expanded': !isEdit }">
        <button type="submit" class="button is-primary" :class="{ 'is-fullwidth': !isEdit }">
          {{ isEdit ? 'Update Activity' : 'Add Activity' }}
        </button>
      </div>
      <div v-if="isEdit" class="control">
        <button type="button" @click="$emit('cancel')" class="button is-light">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useActivities, Activity, Location } from '../models/activity'

interface Props {
  activity?: Activity | null;
  isEdit?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  activity: null,
  isEdit: false,
  compact: false
})

const emit = defineEmits<{
  (e: 'activity-added'): void;
  (e: 'activity-updated'): void;
  (e: 'cancel'): void;
}>()

const { addActivity, updateActivity } = useActivities()

const defaultLocation: Location = { lat: 41.7459793, lng: -74.082801 }
const defaultDate = new Date().toISOString().split('T')[0]

interface ActivityForm {
  type: string;
  distance: number | '';
  distanceUnit: string;
  duration: number | '';
  date: string;
  location: Location;
}

const form = ref<ActivityForm>({
  type: '',
  distance: '',
  distanceUnit: 'mi',
  duration: '',
  date: defaultDate,
  location: { ...defaultLocation }
})

onMounted(() => {
  if (props.activity) {
    form.value = {
      type: props.activity.type,
      distance: props.activity.distance,
      distanceUnit: props.activity.distanceUnit,
      duration: props.activity.duration,
      date: props.activity.date as string,
      location: { ...props.activity.location }
    }
  }
})

const handleSubmit = () => {
  if (!form.value.type || form.value.distance === '' || form.value.duration === '') {
    return
  }

  const activityData = {
    type: form.value.type,
    distance: Number(form.value.distance),
    distanceUnit: form.value.distanceUnit,
    duration: Number(form.value.duration),
    date: form.value.date,
    location: { ...form.value.location }
  }

  if (props.isEdit && props.activity) {
    if (updateActivity(props.activity.id, activityData)) {
      emit('activity-updated')
    }
  } else {
    if (addActivity(activityData)) {
      form.value = {
        type: '',
        distance: '',
        distanceUnit: 'mi',
        duration: '',
        date: defaultDate,
        location: { ...defaultLocation }
      }
      emit('activity-added')
    }
  }
}
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}
</style>