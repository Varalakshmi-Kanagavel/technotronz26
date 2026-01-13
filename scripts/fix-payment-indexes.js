// Run: node scripts/fix-payment-indexes.js
const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// Parse .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim()
  }
})

async function fixIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db()
    
    // List all collections
    const collections = await db.listCollections().toArray()
    console.log('\nCollections:', collections.map(c => c.name).join(', '))
    
    // Check ALL collections for authUserId index
    for (const col of collections) {
      console.log(`\n--- ${col.name.toUpperCase()} ---`)
      const indexes = await db.collection(col.name).indexes()
      indexes.forEach(idx => console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)} ${idx.unique ? '(UNIQUE)' : ''} ${idx.sparse ? '(SPARSE)' : ''}`))
      
      // Try to drop authUserId_1 if exists
      try {
        await db.collection(col.name).dropIndex('authUserId_1')
        console.log(`  ✅ Dropped authUserId_1 from ${col.name}`)
      } catch (e) {
        // silently skip if not found
      }
      
      // Clean null authUserId
      try {
        const r = await db.collection(col.name).updateMany(
          { authUserId: null },
          { $unset: { authUserId: '' } }
        )
        if (r.modifiedCount > 0) {
          console.log(`  ✅ Cleaned ${r.modifiedCount} docs with null authUserId`)
        }
      } catch(e) {}
    }
    
    console.log('\n✅ Done! Restart your dev server now.')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

fixIndexes()
