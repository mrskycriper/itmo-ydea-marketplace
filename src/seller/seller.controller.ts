import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create.seller.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateSellerDto } from './dto/update.seller.dto';

@ApiTags('seller')
@Controller()
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new seller' })
  @ApiBody({ type: CreateSellerDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Post('/sellers')
  async createSeller(
    @Body() createSellerDto: CreateSellerDto,
  ): Promise<object> {
    return await this.sellerService.createSeller(createSellerDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete seller' })
  @ApiParam({
    name: 'sellerId',
    type: 'number',
    description: 'Unique seller id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  // TODO Seller guard (c проверкой id)
  @Delete('sellers/:sellerId')
  async deleteSeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return await this.sellerService.deleteSeller(sellerId);
  }

  @ApiOperation({ summary: 'Get seller' })
  @ApiParam({
    name: 'sellerId',
    type: 'number',
    description: 'Unique seller id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('sellers/:sellerId')
  @Render('seller')
  async getSeller(
    @SessionDecorator() session: SessionContainer,
    @Param('sellerId', ParseIntPipe) sellerId: number,
  ): Promise<object> {
    return await this.sellerService.getSeller(sellerId);
  }

  @ApiOperation({ summary: 'Update seller' })
  @ApiParam({
    name: 'sellerId',
    type: 'number',
    description: 'Unique seller id',
  })
  @ApiBody({ type: UpdateSellerDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch('sellers/:sellerId')
  async updateSeller(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return await this.sellerService.updateSeller(sellerId, updateSellerDto);
  }
}
