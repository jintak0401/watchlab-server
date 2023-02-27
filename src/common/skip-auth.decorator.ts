import { SetMetadata } from '@nestjs/common';

import { publicDecoKey } from '@/utils/constant';

export const Public = () => SetMetadata(publicDecoKey, true);
