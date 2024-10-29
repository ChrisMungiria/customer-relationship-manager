import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.customerService.getCustomers();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCustomer(@Body() body: any) {
    return this.customerService.createCustomer(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('Deleting customer...');
    return this.customerService.deleteCustomer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(@Param('id') id) {
    const project = await this.customerService.findCustomerById(id);
    if (!project) {
      throw new ForbiddenException('Customer not found');
    }

    return project;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.customerService.update(id, body);
  }
}
