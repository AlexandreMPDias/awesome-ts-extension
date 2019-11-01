import { ITemplateSimple, ITemplates } from './types';

import native from './native';
import shared from './shared';

const dftExport: ITemplates = {
    native,
    shared
}

export default dftExport;