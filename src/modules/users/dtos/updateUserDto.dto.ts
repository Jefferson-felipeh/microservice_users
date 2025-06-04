import { PartialType } from "@nestjs/swagger";
import { CreateUserDTO } from "./createUserDto.dto";

export class UpdateUserDto extends PartialType(CreateUserDTO){}