import config from 'config';

export function getEnv(envName:string):any {
  return config.get(envName);
}
