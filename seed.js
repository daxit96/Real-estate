// Seed script for creating demo tenant with sample data
import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/realestate_crm'
});

// Demo data structure
const DEMO_TENANT = {
  name: 'Acme Realty',
  subdomain: 'acme',
  status: 'active'
};

const DEMO_USERS = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@acmerealty.com',
    password: 'admin123',
    role: 'OWNER'
  },
  {
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'amit@acmerealty.com',
    password: 'agent123',
    role: 'AGENT'
  },
  {
    firstName: 'Priya',
    lastName: 'Gupta',
    email: 'priya@acmerealty.com',
    password: 'agent123',
    role: 'AGENT'
  },
  {
    firstName: 'Ravi',
    lastName: 'Kumar',
    email: 'ravi@acmerealty.com',
    password: 'account123',
    role: 'ACCOUNT'
  }
];

const DEMO_PROPERTIES = [
  {
    title: '3BHK Luxury Apartment',
    description: 'Spacious luxury apartment in prime location with modern amenities.',
    address: '123 Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 25000000,
    area: 1850,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    status: 'available',
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Power Backup']
  },
  {
    title: 'Premium Villa with Pool',
    description: 'Beautiful villa with private swimming pool and garden.',
    address: '456 Juhu Beach Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400049',
    propertyType: 'villa',
    listingType: 'both',
    price: 42000000,
    rentPrice: 250000,
    area: 3200,
    bedrooms: 4,
    bathrooms: 4,
    parking: 3,
    status: 'available',
    amenities: ['Private Pool', 'Garden', 'Security', 'Servant Quarter']
  },
  {
    title: 'Penthouse Suite',
    description: 'Luxurious penthouse with panoramic city views.',
    address: '789 Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    propertyType: 'penthouse',
    listingType: 'sale',
    price: 68000000,
    area: 4500,
    bedrooms: 4,
    bathrooms: 5,
    parking: 4,
    status: 'available',
    amenities: ['Terrace Garden', 'Private Elevator', 'Jacuzzi', 'Premium Interiors']
  },
  {
    title: 'Sea View Apartment',
    description: 'Apartment with stunning sea views in prime location.',
    address: '321 Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400002',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 32000000,
    area: 2100,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    status: 'hold',
    amenities: ['Sea View', 'Gym', 'Swimming Pool', 'Concierge']
  },
  {
    title: 'Modern Studio',
    description: 'Contemporary studio apartment perfect for young professionals.',
    address: '654 Powai Central',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    propertyType: 'studio',
    listingType: 'sale',
    price: 18000000,
    area: 650,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    status: 'sold',
    amenities: ['Modern Interiors', 'Security', 'Parking', 'Metro Connectivity']
  },
  {
    title: '2BHK Family Apartment',
    description: 'Perfect family apartment in residential complex.',
    address: '987 Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    propertyType: 'apartment',
    listingType: 'rent',
    price: 15000000,
    rentPrice: 45000,
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    status: 'available',
    amenities: ['Kids Play Area', 'Security', 'Power Backup', 'Shopping Complex']
  },
  {
    title: 'Commercial Office Space',
    description: 'Prime commercial space in business district.',
    address: '147 Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    propertyType: 'office',
    listingType: 'rent',
    price: 50000000,
    rentPrice: 150000,
    area: 2500,
    parking: 10,
    status: 'available',
    amenities: ['Central AC', 'High Speed Internet', 'Reception Area', 'Conference Room']
  },
  {
    title: 'Luxury 4BHK Duplex',
    description: 'Spacious duplex with premium fittings and fixtures.',
    address: '258 Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 55000000,
    area: 3800,
    bedrooms: 4,
    bathrooms: 4,
    parking: 3,
    status: 'available',
    amenities: ['Duplex Layout', 'Premium Interiors', 'Balcony Garden', 'Home Theater']
  },
  {
    title: 'Beach Front Villa',
    description: 'Exclusive beachfront property with private beach access.',
    address: '369 Versova Beach',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400061',
    propertyType: 'villa',
    listingType: 'sale',
    price: 75000000,
    area: 5000,
    bedrooms: 5,
    bathrooms: 6,
    parking: 4,
    status: 'available',
    amenities: ['Private Beach', 'Swimming Pool', 'Landscaped Garden', 'Security']
  },
  {
    title: 'Budget 1BHK Apartment',
    description: 'Affordable 1BHK perfect for first-time buyers.',
    address: '741 Malad East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400097',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 8500000,
    area: 600,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    status: 'available',
    amenities: ['Security', 'Lift', 'Water Supply', 'Electricity Backup']
  }
];

const DEMO_CONTACTS = [
  {
    firstName: 'Rajesh',
    lastName: 'Mehta',
    email: 'rajesh.mehta@email.com',
    phone: '+91 98765 43210',
    contactType: 'buyer',
    source: 'website',
    city: 'Mumbai'
  },
  {
    firstName: 'Sneha',
    lastName: 'Patel',
    email: 'sneha.patel@email.com',
    phone: '+91 87654 32109',
    contactType: 'seller',
    source: 'referral',
    city: 'Pune'
  },
  {
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 76543 21098',
    contactType: 'investor',
    source: 'advertisement',
    city: 'Mumbai'
  }
];

const DEMO_LEADS = [
  {
    firstName: 'Arjun',
    lastName: 'Singh',
    email: 'arjun.singh@email.com',
    phone: '+91 98765 43210',
    source: 'website',
    status: 'new',
    budget: 12000000,
    requirements: 'Looking for 2BHK in Andheri',
    priority: 'hot'
  },
  {
    firstName: 'Maya',
    lastName: 'Sharma',
    email: 'maya.sharma@email.com',
    phone: '+91 87654 32109',
    source: 'referral',
    status: 'contacted',
    budget: 50000000,
    requirements: 'Interested in luxury apartments',
    priority: 'medium'
  },
  {
    firstName: 'Kiran',
    lastName: 'Joshi',
    email: 'kiran.joshi@email.com',
    phone: '+91 76543 21098',
    source: 'social_media',
    status: 'qualified',
    budget: 25000000,
    requirements: 'Villa with swimming pool',
    priority: 'high'
  },
  {
    firstName: 'Deepika',
    lastName: 'Rao',
    email: 'deepika.rao@email.com',
    phone: '+91 65432 10987',
    source: 'cold_call',
    status: 'new',
    budget: 8000000,
    requirements: 'First-time buyer looking for 1BHK',
    priority: 'low'
  },
  {
    firstName: 'Suresh',
    lastName: 'Kumar',
    email: 'suresh.kumar@email.com',
    phone: '+91 54321 09876',
    source: 'website',
    status: 'contacted',
    budget: 35000000,
    requirements: 'Commercial space in BKC',
    priority: 'high'
  }
];

// Helper functions
async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if demo tenant already exists
    const existingTenant = await executeQuery(
      'SELECT id FROM tenants WHERE subdomain = $1',
      [DEMO_TENANT.subdomain]
    );

    if (existingTenant.rows.length > 0) {
      console.log('⚠️  Demo tenant already exists. Skipping seed.');
      return;
    }

    // Create demo tenant
    console.log('📦 Creating demo tenant...');
    const tenantResult = await executeQuery(`
      INSERT INTO tenants (id, name, subdomain, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [randomUUID(), DEMO_TENANT.name, DEMO_TENANT.subdomain, DEMO_TENANT.status]);

    const tenantId = tenantResult.rows[0].id;
    console.log(`✅ Created tenant: ${DEMO_TENANT.name} (${tenantId})`);

    // Create demo users
    console.log('👥 Creating demo users...');
    const userIds = [];
    for (const user of DEMO_USERS) {
      const userId = randomUUID();
      const hashedPassword = await hashPassword(user.password);
      
      await executeQuery(`
        INSERT INTO users (id, first_name, last_name, email, password, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [userId, user.firstName, user.lastName, user.email, hashedPassword, true]);

      // Link user to tenant
      await executeQuery(`
        INSERT INTO user_tenants (id, user_id, tenant_id, role, is_active)
        VALUES ($1, $2, $3, $4, $5)
      `, [randomUUID(), userId, tenantId, user.role, true]);

      userIds.push({ id: userId, role: user.role, name: `${user.firstName} ${user.lastName}` });
      console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.role})`);
    }

    // Create default pipelines
    console.log('🔄 Creating default pipelines...');
    const salesPipelineId = randomUUID();
    const rentalsPipelineId = randomUUID();

    await executeQuery(`
      INSERT INTO pipelines (id, tenant_id, name, description, is_active)
      VALUES ($1, $2, $3, $4, $5)
    `, [salesPipelineId, tenantId, 'Sales Pipeline', 'Primary sales pipeline for property sales', true]);

    await executeQuery(`
      INSERT INTO pipelines (id, tenant_id, name, description, is_active)
      VALUES ($1, $2, $3, $4, $5)
    `, [rentalsPipelineId, tenantId, 'Rentals Pipeline', 'Pipeline for rental properties', true]);

    // Create stages for sales pipeline
    const salesStages = [
      { name: 'Leads', color: '#6b7280', position: 0 },
      { name: 'Qualified', color: '#3b82f6', position: 1 },
      { name: 'Token', color: '#f59e0b', position: 2 },
      { name: 'Closed', color: '#10b981', position: 3 },
    ];

    const stageIds = [];
    for (const stage of salesStages) {
      const stageId = randomUUID();
      await executeQuery(`
        INSERT INTO stages (id, tenant_id, pipeline_id, name, color, position, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [stageId, tenantId, salesPipelineId, stage.name, stage.color, stage.position, true]);
      stageIds.push(stageId);
    }

    // Create stages for rentals pipeline
    const rentalStages = [
      { name: 'Inquiry', color: '#6b7280', position: 0 },
      { name: 'Viewing', color: '#3b82f6', position: 1 },
      { name: 'Application', color: '#f59e0b', position: 2 },
      { name: 'Leased', color: '#10b981', position: 3 },
    ];

    for (const stage of rentalStages) {
      const stageId = randomUUID();
      await executeQuery(`
        INSERT INTO stages (id, tenant_id, pipeline_id, name, color, position, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [stageId, tenantId, rentalsPipelineId, stage.name, stage.color, stage.position, true]);
    }

    console.log('✅ Created pipelines and stages');

    // Create demo properties
    console.log('🏠 Creating demo properties...');
    const propertyIds = [];
    const ownerUser = userIds.find(u => u.role === 'OWNER');

    for (const property of DEMO_PROPERTIES) {
      const propertyId = randomUUID();
      await executeQuery(`
        INSERT INTO properties (
          id, tenant_id, title, description, address, city, state, pincode,
          property_type, listing_type, price, rent_price, area, bedrooms, 
          bathrooms, parking, status, amenities, images, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      `, [
        propertyId, tenantId, property.title, property.description, property.address,
        property.city, property.state, property.pincode, property.propertyType,
        property.listingType, property.price, property.rentPrice || null, property.area,
        property.bedrooms || null, property.bathrooms || null, property.parking || null,
        property.status, JSON.stringify(property.amenities), JSON.stringify([]),
        ownerUser.id
      ]);
      propertyIds.push(propertyId);
    }
    console.log(`✅ Created ${DEMO_PROPERTIES.length} properties`);

    // Create demo contacts
    console.log('📞 Creating demo contacts...');
    const contactIds = [];
    const agentUser = userIds.find(u => u.role === 'AGENT');

    for (const contact of DEMO_CONTACTS) {
      const contactId = randomUUID();
      await executeQuery(`
        INSERT INTO contacts (
          id, tenant_id, first_name, last_name, email, phone, 
          contact_type, source, city, assigned_to
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        contactId, tenantId, contact.firstName, contact.lastName, contact.email,
        contact.phone, contact.contactType, contact.source, contact.city, agentUser.id
      ]);
      contactIds.push(contactId);
    }
    console.log(`✅ Created ${DEMO_CONTACTS.length} contacts`);

    // Create demo leads
    console.log('🎯 Creating demo leads...');
    for (const lead of DEMO_LEADS) {
      const leadId = randomUUID();
      await executeQuery(`
        INSERT INTO leads (
          id, tenant_id, first_name, last_name, email, phone, source,
          status, budget, requirements, priority, assigned_to
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        leadId, tenantId, lead.firstName, lead.lastName, lead.email, lead.phone,
        lead.source, lead.status, lead.budget, lead.requirements, lead.priority, agentUser.id
      ]);
    }
    console.log(`✅ Created ${DEMO_LEADS.length} leads`);

    // Create demo deals
    console.log('💼 Creating demo deals...');
    const deals = [
      {
        title: 'Luxury Apartment Sale - Rajesh Mehta',
        value: 25000000,
        stageId: stageIds[1], // Qualified
        propertyId: propertyIds[0],
        contactId: contactIds[0],
        probability: 75,
        position: 0
      },
      {
        title: 'Villa Purchase - Vikram Singh',
        value: 42000000,
        stageId: stageIds[2], // Token
        propertyId: propertyIds[1],
        contactId: contactIds[2],
        probability: 90,
        position: 0
      }
    ];

    for (const deal of deals) {
      const dealId = randomUUID();
      await executeQuery(`
        INSERT INTO deals (
          id, tenant_id, title, pipeline_id, stage_id, property_id, contact_id,
          value, probability, assigned_to, position
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        dealId, tenantId, deal.title, salesPipelineId, deal.stageId, deal.propertyId,
        deal.contactId, deal.value, deal.probability, agentUser.id, deal.position
      ]);
    }
    console.log(`✅ Created ${deals.length} deals`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Owner: john@acmerealty.com / admin123');
    console.log('Agent: amit@acmerealty.com / agent123');
    console.log('Agent: priya@acmerealty.com / agent123');
    console.log('Account: ravi@acmerealty.com / account123');
    console.log('\n🌐 Demo Tenant: Acme Realty (subdomain: acme)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export default seedDatabase;
