import { PartialType } from "@nestjs/swagger";
import { CreateUserDTO } from "./createUserDto.dto";

export class QueryUserDto extends PartialType(CreateUserDTO){}