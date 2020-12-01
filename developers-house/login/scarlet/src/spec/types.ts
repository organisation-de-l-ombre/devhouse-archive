/*
 * Interface for requesting a user creation.
 */

import {IsOptional, IsString, Length} from "class-validator";

type Platform = 'discord' | 'github' | 'google' | 'instagram';

export class UserCreateRequest {
    @IsString()
    platform: Platform;
    @IsString()
    platformId: string;
    @IsString()
    @Length(32)
    username: string;
    @IsString()
    @Length(60)
    avatar: string;
}

export class InitiateLoginRequest {
    @IsString()
    platform: Platform;
    @IsString()
    platformId: string;
    @IsString()
    @IsOptional()
    twoFaCode?: string;
}