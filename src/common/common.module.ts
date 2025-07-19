import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { LogService } from './services/logService';

@Global()
@Module({
    providers: [CommonService, LogService],
    exports: [CommonService, LogService ]
})
export class CommonModule {}
