import { DefinitionsService } from '@typeswarm/cli';
import { parseService, StrictService } from '@typeswarm/cli/lib/normalize';
import immer from 'immer';

export const unpublishPort = (target: number) => (
    service: DefinitionsService
): StrictService => {
    return immer(parseService(service), (service: StrictService) => {
        service.ports = (service.ports ?? []).filter(
            (port) => port.target !== target
        );
    });
};
