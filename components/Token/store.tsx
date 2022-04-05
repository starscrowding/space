import { useState, useMemo, FormEvent } from 'react';
import { Input } from '@nextui-org/react';
import { BASE } from '@space/hooks/api';
import { useNftStorage } from '@space/hooks/nft';
import { metaToBlob } from '@space/components/Token';
import { post, ENDPOINT } from '@space/hooks/api';

interface StoreTokenProps {
  meta: {
    image: string;
    head: string;
  };
  onNext?(): void;
}

export const StoreToken = ({ meta }: StoreTokenProps) => {
  const [step, setStep] = useState('nft');
  const STORE_KEY = 'STORE_KEY';
  const [storeKey, setStoreKey] = useState<string>(
    localStorage.getItem(STORE_KEY) as string
  );
  const [storeKeyType, setStoreKeyType] = useState<string>('password');
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [birthday, setBirthday] = useState<number>();
  const nftStorage = useNftStorage(storeKey);
  const [ipfs, setIpfs] = useState<string>();
  const [dbResult, setDbResult] = useState();

  const metaData = useMemo(() => {
    return {
      id,
      name,
      description,
      image: meta?.image || '',
      head: meta?.head || '',
      external_url: `${BASE}/${name}*${id}`,
      animation_url: `${BASE}/${name}*${id}?i=1`,
      background_color: '000000',
      attributes: [
        {
          display_type: 'date',
          trait_type: 'birthday',
          value: birthday,
        },
      ],
    };
  }, [id, name, description, meta, birthday]);

  const updateStoreKey = (key: string) => {
    localStorage.setItem(STORE_KEY, key);
    setStoreKey(key);
  };

  const updateBirthday = (value: string = '') => {
    const timestamp = Math.floor(new Date(value).getTime() / 1000);
    setId(timestamp.toString());
    setBirthday(timestamp);
  };

  const updateName = (value: string = '') => {
    const v = value.trim();
    const n = v.trim().split(' ').join('').toLowerCase();
    setName(n);
    setDescription(`${n} token`);
  };

  const onSubmit = async (e: FormEvent) => {
    e && e.preventDefault();
    try {
      const metaBlob = metaToBlob(metaData);
      const ipfsData = await nftStorage.storeBlob(metaBlob);
      setIpfs(ipfsData);
    } catch (error) {
      console.log(error);
    }
  };

  const onDbSave = async () => {
    const res = await post(ENDPOINT.token.index, {
      id: metaData.id,
      name: metaData.name,
      ipfs,
    });
    setDbResult(res);
  };

  const isReady = !!(
    storeKey &&
    meta?.image &&
    meta?.head &&
    name &&
    id &&
    description &&
    birthday
  );

  return (
    <div>
      <div>
        <button onClick={() => setStep('nft')}>NFT</button>
        <button onClick={() => setStep('db')}>DB</button>
      </div>
      {step === 'nft' && (
        <>
          <Input
            id="store-key"
            placeholder="Store key"
            bordered
            width="100%"
            css={{ p: '$10' }}
            value={storeKey}
            type={storeKeyType}
            onFocus={() => setStoreKeyType('text')}
            onBlur={() => setStoreKeyType('password')}
            onChange={(e) => updateStoreKey(e?.target?.value || '')}
          />

          {!ipfs && (
            <form onSubmit={onSubmit}>
              <div>
                birthday:{' '}
                <input
                  required
                  type="datetime-local"
                  onChange={(e) => updateBirthday(e.target.value)}
                />
              </div>
              <div>
                name:{' '}
                <input required onChange={(e) => updateName(e.target.value)} />
              </div>
              <pre>{JSON.stringify(metaData, null, 2)}</pre>
              <button
                type="submit"
                disabled={!isReady}
                style={isReady ? { color: 'gold' } : {}}
              >
                Submit
              </button>
            </form>
          )}

          {ipfs && (
            <a
              href={`${ENDPOINT.ipfs}/${ipfs}`}
              target="_blank"
              rel="noreferrer"
            >
              {ipfs}
            </a>
          )}
        </>
      )}

      {step === 'db' && (
        <>
          {!dbResult && ipfs && metaData && (
            <div>
              <pre>
                {JSON.stringify(
                  {
                    id: metaData.id,
                    name: metaData.name,
                    ipfs,
                  },
                  null,
                  2
                )}
              </pre>
              <button onClick={onDbSave} style={{ color: 'gold' }}>
                Save
              </button>
            </div>
          )}
          {!ipfs && (
            <div>
              <Input underlined placeholder="Search" />
            </div>
          )}
          {dbResult && (
            <div>
              <pre>{JSON.stringify(dbResult, null, 2)}</pre>
              <button onClick={() => setDbResult(undefined)}>Reset</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
