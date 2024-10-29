import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with faker...');

  // Create Users
  for (let i = 0; i < 5; i++) {
    const hashedPassword = await bcryptjs.hash('password', 10);
    await prisma.user.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
      },
    });
  }

  // Create Customers
  for (let i = 0; i < 10; i++) {
    await prisma.customer.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        companyName: faker.company.name(),
      },
    });
  }

  // Get all customers
  const customers = await prisma.customer.findMany();

  // Create Leads
  for (let i = 0; i < 20; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    await prisma.lead.create({
      data: {
        customerId: customer.id,
        status: faker.helpers.arrayElement([
          'NEW',
          'CONTACTED',
          'QUALIFIED',
          'LOST',
          'WON',
        ]),
      },
    });
  }

  // Get all leads
  const leads = await prisma.lead.findMany();

  // Create Interactions
  for (let i = 0; i < 50; i++) {
    const lead = leads[Math.floor(Math.random() * leads.length)];
    await prisma.interaction.create({
      data: {
        leadId: lead.id,
        type: faker.helpers.arrayElement([
          'PHONE_CALL',
          'EMAIL',
          'MEETING',
          'OTHER',
        ]),
        notes: faker.lorem.sentence(),
      },
    });
  }

  console.log('Database seeded successfully with faker data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
