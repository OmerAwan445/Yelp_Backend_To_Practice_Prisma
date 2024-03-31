import config from 'config';

export function getEnv(envName:string) {
  return config.get(envName);
}
