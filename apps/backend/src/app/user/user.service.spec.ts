import { Test, TestingModule } from '@nestjs/testing';

// ============ Entities ================
import { UserService } from './user.service';
import { UsersRepoService } from '@/src/domain/repos/user-repos.service';
import { UserDto } from './domain/user.dto';
import { JwtAuthGuard } from '@/src/libs/security/guards/security.guard';
describe('CartService', () => {
  let service: UserService;
  let repo: UsersRepoService;

  const user: UserDto = {
    id: "test",
    email: "test",
    first_name: 'string',
    last_name: 'string',
    tickets: []
  }
  const mockUserRepo = {

  }

  const mockPermissionGuard = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UsersRepoService],
    })
      .overrideProvider(UsersRepoService).useValue(mockUserRepo)
      .overrideGuard(JwtAuthGuard).useValue(mockPermissionGuard)
      .compile();

    service = module.get<UserService>(UserService);
    repo = module.get<UsersRepoService>(UsersRepoService)
  });

  describe('cart service functions', () => {
    it('should return carts', async () => {
      repo.getAllUsers = jest.fn().mockResolvedValue([user])
      expect(await service.getAllUsers(1)).toEqual([user])
    })

    // it('should return cart by id', async () => {
    //   cartRepo.getCartById = jest.fn().mockResolvedValue(cart)
    //   expect(await cartService.getCartById('test')).toEqual(cart)
    // })

    // it('should add product to cart', async () => {
    //   cartRepo.create = jest.fn().mockResolvedValue(cart)
    //   cartRepo.save = jest.fn().mockResolvedValue(cart)
    //   expect(await cartService.addProductToCart(userSession,addProduct)).toEqual(cart)
    // })

    // it('should delete product from cart', async () => {
    //   cartRepo.delete = jest.fn().mockResolvedValue('deleted')
    //   expect(await cartService.deleteProductFromCart('test')).toEqual('deleted')
    // })

    // it('should update product quantity', async () => {
    //   cartRepo.update = jest.fn().mockResolvedValue('updated')
    //   expect(await cartService.updateProductQuantity({
    //     recordId: 'test',
    //     quantity: 4
    //   })).toEqual('updated')
    // })
  })


})