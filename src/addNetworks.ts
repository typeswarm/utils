import { StrictSpecification } from '@typeswarm/cli/lib/normalize';
import immer from 'immer';

export function addNetworks(
    spec: StrictSpecification,
    networks: string[],
    targetServices: string[],
    { external }: { external?: boolean } = {}
): StrictSpecification {
    return immer(spec, (spec) => {
        if (networks.length == 0) {
            return;
        }
        spec.networks = spec.networks ?? {};
        for (const net of networks) {
            spec.networks[net] = { external: !!external };
        }

        if (!spec.services) {
            return;
        }
        for (const svc of targetServices) {
            const service = spec.services[svc];
            if (!service) {
                continue;
            }
            if (!service.networks) {
                service.networks = {};
            }
            for (const net of networks) {
                service.networks[net] = null;
            }
        }
    });
}
