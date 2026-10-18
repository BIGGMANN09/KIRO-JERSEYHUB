require('dotenv').config()
var db = require('./db.js')
var bcrypt = require('bcryptjs')

var USERS = [
  { name: 'Admin User',   email: 'admin@jerseyhub.com',   password: 'Admin@2026!',   role: 'admin'    },
  { name: 'Manager One',  email: 'manager@jerseyhub.com', password: 'Manager@2026!', role: 'admin'    },
  { name: 'Test User 1',  email: 'user1@jerseyhub.com',   password: 'User1@2026!',   role: 'customer' },
  { name: 'Test User 2',  email: 'user2@jerseyhub.com',   password: 'User2@2026!',   role: 'customer' },
  { name: 'Test User 3',  email: 'user3@jerseyhub.com',   password: 'User3@2026!',   role: 'customer' }
]

var PRODUCTS = [
  { name: 'Barcelona Home',                    club: 'La Liga',        category: 'laliga',   price: 24000, image_url: 'images/barcelona-home.jpeg' },
  { name: 'Real Madrid Away, black',           club: 'La Liga',        category: 'laliga',   price: 24000, image_url: 'images/real-madrid-away-black.jpeg' },
  { name: 'Real Madrid Away, orange',          club: 'La Liga',        category: 'laliga',   price: 24000, image_url: 'images/real-madrid-away-orange.jpeg' },
  { name: 'Manchester City Home',              club: 'Premier League', category: 'epl',      price: 24000, image_url: 'images/man-city-home.jpeg' },
  { name: 'Manchester City Away',              club: 'Premier League', category: 'epl',      price: 24000, image_url: 'images/man-city-away.jpeg' },
  { name: 'Liverpool Home',                    club: 'Premier League', category: 'epl',      price: 24000, image_url: 'images/liverpool-home.jpeg' },
  { name: 'Manchester United Home',            club: 'Premier League', category: 'epl',      price: 24000, image_url: 'images/man-united-home.jpeg' },
  { name: 'Arsenal Home',                      club: 'Premier League', category: 'epl',      price: 24000, image_url: 'images/arsenal-home.jpeg' },
  { name: 'Ipswich Town Home',                 club: 'Premier League', category: 'epl',      price: 24000, image_url: 'images/ipswich-home.jpeg' },
  { name: 'Lyon Home',                         club: 'Ligue 1',        category: 'ligue1',   price: 24000, image_url: 'images/lyon-home.jpeg' },
  { name: 'Germany Home',                      club: 'National teams', category: 'national', price: 22000, image_url: 'images/germany-home.jpeg' },
  { name: 'Germany Retro',                     club: 'National teams', category: 'national', price: 22000, image_url: 'images/germany-retro.jpeg' },
  { name: 'Spain Home',                        club: 'National teams', category: 'national', price: 22000, image_url: 'images/spain-home.jpeg' },
  { name: 'Custom Kit, black and white stripes', club: 'Custom print', category: 'custom',  price: 22000, image_url: 'images/custom-stripes.jpeg' },
  { name: 'Custom Kit, red pattern',           club: 'Custom print',  category: 'custom',   price: 22000, image_url: 'images/custom-red-pattern.jpeg' },
  { name: 'Custom Kit, number 10',             club: 'Custom print',  category: 'custom',   price: 22000, image_url: 'images/custom-number-10.jpeg' },
  { name: 'Custom Kit, blue stripes',          club: 'Custom print',  category: 'custom',   price: 22000, image_url: 'images/custom-blue-stripes.jpeg' },
  { name: 'Custom Kit, red and blue',          club: 'Custom print',  category: 'custom',   price: 22000, image_url: 'images/custom-red-blue.jpeg' },
  { name: 'Custom Kit, navy and lime',         club: 'Custom print',  category: 'custom',   price: 22000, image_url: 'images/custom-navy-lime.jpeg' },
  { name: 'Custom Kit, grey team name',        club: 'Custom print',  category: 'custom',   price: 22000, image_url: 'images/custom-grey.jpeg' },
  { name: 'Custom Kit, blue',                  club: 'Custom print',  category: 'custom',   price: 22000, image_url: 'images/custom-blue.jpeg' }
]

;(async function run() {
  console.log('Seeding users...')

  var insertUser = db.prepare(
    'INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  )

  for (var i = 0; i < USERS.length; i++) {
    var u = USERS[i]
    var hash = await bcrypt.hash(u.password, 12)
    insertUser.run(u.name, u.email, hash, u.role)
    console.log('  User seeded: ' + u.email)
  }

  console.log('Seeding products...')

  var insertProduct = db.prepare(
    'INSERT OR IGNORE INTO products (name, club, category, price, image_url) VALUES (?, ?, ?, ?, ?)'
  )

  for (var j = 0; j < PRODUCTS.length; j++) {
    var p = PRODUCTS[j]
    insertProduct.run(p.name, p.club, p.category, p.price, p.image_url)
    console.log('  Product seeded: ' + p.name)
  }

  console.log('Seed complete')
  db.close()
})()
