export const webnodeIdRegExp =
  /^(?=.*[0-9a-z])(?![.-])(?:[0-9a-z]+(?:[-.]?[0-9a-z]+)*)$/;

export const baseDomainRegExp =
  /^(?=.{1,253}$)((?!-)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(xn--)?([a-z0-9]+(-[a-z0-9]+)*\.)*[a-z]{2,63}$/;

export const NODE_ENVS = ['development', 'production'] as const;

export const validPortRange = { min: 3000, max: 65535 };
