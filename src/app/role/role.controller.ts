import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
    constructor(
        private roleService: RoleService
    ) { }
    @Post()
    async signIn(@Body() body) {
        return this.roleService.createRole(body.value)
    }
}
