import { ref, computed } from 'vue'
import { useAuth } from './user'

export interface Location {
  lat: number;
  lng: number;
}

export interface Activity {
  id: number;
  userId: number;
  type: string;
  distance: number;
  distanceUnit: string;
  duration: number; 
  date: Date | string;
  location: Location;
}

export interface ActivityStats {
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  avgDuration: number;
  activityBreakdown: Record<string, number>;
}

const activities = ref<Activity[]>([
  {
    id: 1,
    userId: 1,
    type: 'Run',
    distance: 3.1,
    distanceUnit: 'mi',
    duration: 30,
    date: new Date('2025-02-20'),
    location: { lat: 41.7459793, lng: -74.082801 }
  },
  {
    id: 2,
    userId: 2,
    type: 'Walk',
    distance: 1.2,
    distanceUnit: 'mi',
    duration: 45,
    date: new Date('2025-02-15'),
    location: { lat: 41.7459793, lng: -74.082801 }
  },
  {
    id: 3,
    userId: 1,
    type: 'Cycle',
    distance: 15.5,
    distanceUnit: 'km',
    duration: 60, 
    date: new Date('2025-02-18'),
    location: { lat: 41.7459793, lng: -74.082801 }
  },
  {
    id: 4,
    userId: 3,
    type: 'Swim',
    distance: 1000,
    distanceUnit: 'm',
    duration: 35, 
    date: new Date('2025-02-19'),
    location: { lat: 41.7459793, lng: -74.082801 }
  }
])

export function useActivities() {
  const { currentUser, getFriends } = useAuth()

  const getUserActivities = computed((): Activity[] => {
    if (!currentUser.value) return []
    return activities.value
      .filter(activity => activity.userId === currentUser.value!.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  const getFriendsActivities = computed((): Activity[] => {
    if (!currentUser.value) return []
    
    const friends = getFriends()
    const friendIds = friends.map(friend => friend.id)
    
    return activities.value
      .filter(activity => friendIds.includes(activity.userId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })


  const addActivity = (activityData: Omit<Activity, 'id' | 'userId' | 'date'> & { date?: string }): boolean => {
    if (!currentUser.value) return false
    
    const maxId = Math.max(...activities.value.map(a => a.id), 0)
    
    const newActivity: Activity = {
      ...activityData,
      id: maxId + 1,
      userId: currentUser.value.id,
      date: activityData.date || new Date().toISOString().split('T')[0]
    }
    activities.value.push(newActivity)
    return true
  }


  const updateActivity = (id: number, activityData: Partial<Omit<Activity, 'id' | 'userId'>>): boolean => {
    if (!currentUser.value) return false
    const index = activities.value.findIndex(a => a.id === id)
    if (index === -1) return false
    if (activities.value[index].userId !== currentUser.value.id) return false
    activities.value[index] = { ...activities.value[index], ...activityData }
    return true
  }

  const deleteActivity = (id: number): boolean => {
    if (!currentUser.value) return false
    const index = activities.value.findIndex(a => a.id === id)
    if (index === -1) return false
    if (activities.value[index].userId !== currentUser.value.id) return false
    activities.value.splice(index, 1)
    return true
  }
  const getActivityStats = computed((): ActivityStats => {
    if (!currentUser.value || getUserActivities.value.length === 0) {
      return {
        totalActivities: 0,
        totalDistance: 0,
        totalDuration: 0,
        avgDuration: 0,
        activityBreakdown: {}
      }
    }
    
    const userActs = getUserActivities.value
    
    const totalActivities = userActs.length
    const totalDuration = userActs.reduce((sum, act) => sum + act.duration, 0)
    const avgDuration = totalDuration / totalActivities
    
    const activityBreakdown = userActs.reduce<Record<string, number>>((breakdown, act) => {
      if (!breakdown[act.type]) {
        breakdown[act.type] = 0
      }
      breakdown[act.type]++
      return breakdown
    }, {})
    
    const totalDistance = userActs.reduce((sum, act) => {
      let distance = act.distance
      switch(act.distanceUnit) {
        case 'km':
          distance = distance * 0.621371 
          break
        case 'm':
          distance = distance * 0.000621371 
          break
        case 'ft':
          distance = distance * 0.000189394 
          break
      }
      return sum + distance
    }, 0)
    
    return {
      totalActivities,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      totalDuration,
      avgDuration: parseFloat(avgDuration.toFixed(2)),
      activityBreakdown
    }
  })

  const getActivityById = (id: number): Activity | null => {
    return activities.value.find(activity => activity.id === id) || null
  }

  return {
    getUserActivities,
    getFriendsActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivityStats,
    getActivityById
  }
}