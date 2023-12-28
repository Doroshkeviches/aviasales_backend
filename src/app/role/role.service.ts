import { RolesReposService } from '@/src/domain/repos/roles-repos.service';
import { Injectable } from '@nestjs/common';
import { UserRoles } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(private roleRepos: RolesReposService) { }
    async createRole(type: UserRoles) {
        return this.roleRepos.createRole(type)
    }
}
