import { Module } from '@complycloud/brane';
import { readFile } from 'fs';
import YAML from 'js-yaml';
import { pick } from 'lodash';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

async function loadConfigurationFile() {
  const configFile = resolvePath(process.cwd(), 'brane.yml');
  const config = YAML.safeLoad(await readFileAsync(configFile, 'utf8'));
  return config;
}

export default class Configuration extends Module {
  get name() { return 'config'; }

  async expose(component) {
    return pick(this.config, ['global', component.name]);
  }

  async start() {
    const config = {
      global: {
        service: {
          name: process.env.SERVICE_NAME || 'service',
        },
      },
    };
    this.config = Object.assign(await loadConfigurationFile.call(this), config);
  }
}
