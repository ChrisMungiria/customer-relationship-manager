import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getCustomers() {
    return this.prisma.customer.findMany({});
  }

  async createCustomer(data) {
    return await this.prisma.customer.create({
      data,
    });
  }

  async deleteCustomer(id: string) {
    await this.prisma.interaction.deleteMany({
      where: {
        lead: {
          customerId: parseInt(id),
        },
      },
    });

    await this.prisma.lead.deleteMany({
      where: {
        customerId: parseInt(id),
      },
    });
    return await this.prisma.customer.delete({
      where: {
        id: parseInt(id),
      },
    });
  }

  async findCustomerById(id: string) {
    return await this.prisma.customer.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }
  async update(id: string, data: any) {
    return await this.prisma.customer.update({
      where: {
        id: parseInt(id),
      },
      data,
    });
  }
}
