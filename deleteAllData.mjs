import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import fs from 'fs'

// Đọc .env file
const envContent = fs.readFileSync('.env', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) envVars[key.trim()] = value.trim()
})

const firebaseConfig = {
  apiKey:            envVars.VITE_FIREBASE_API_KEY,
  authDomain:        envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             envVars.VITE_FIREBASE_APP_ID,
}

console.log('🔥 Kết nối Firebase:', firebaseConfig.projectId)

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const collections = ['employees', 'questions', 'exams', 'results']

async function deleteAllData() {
  try {
    for (const colName of collections) {
      console.log(`\n⏳ Đang xóa collection: ${colName}...`)
      const snapshot = await getDocs(collection(db, colName))

      let count = 0
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, colName, d.id))
        count++
      }

      console.log(`✅ Đã xóa ${count} documents từ ${colName}`)
    }

    console.log('\n✨ Hoàn tất! Tất cả dữ liệu đã được xóa.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Lỗi:', err.message)
    process.exit(1)
  }
}

deleteAllData()
