import { Module } from "@nestjs/common";
import { CityService } from "./city.service";
import { CityReposService } from "@/src/domain/repos/city-repos.service";
import { CityController } from "./city.controller";
import { PrismaModule } from "@/src/libs/prisma/src";

@Module({
  imports: [PrismaModule],
  providers: [CityService, CityReposService],
  controllers: [CityController],
})
export class CityModule {}
