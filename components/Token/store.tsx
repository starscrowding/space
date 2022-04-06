import {useState, useMemo, FormEvent} from 'react';
import {Input} from '@nextui-org/react';
import {BASE} from '@space/hooks/api';
import {useNftStorage} from '@space/hooks/nft';
import {metaToBlob} from '@space/components/Token';
import {api, post, ENDPOINT} from '@space/hooks/api';

interface StoreTokenProps {
  meta: {
    image: string;
    head: string;
  };
  onNext?(): void;
}

export const StoreToken = ({meta}: StoreTokenProps) => {
  const [step, setStep] = useState('nft');
  const STORE_KEY = 'STORE_KEY';
  const [storeKey, setStoreKey] = useState<string>(localStorage.getItem(STORE_KEY) as string);
  const [storeKeyType, setStoreKeyType] = useState<string>('password');
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>(meta?.image || '');
  const [head, setHead] = useState<string>(meta?.head || '');
  const [birthday, setBirthday] = useState<number>();
  const nftStorage = useNftStorage(storeKey);
  const [ipfs, setIpfs] = useState<string>();
  const [preloadIpfs, setPreloadIpfs] = useState<string>();
  const [dbSearch, setDbSearch] = useState<string>();
  const [dbResult, setDbResult] = useState();
  const [dbResultAsText, setDbResultAsText] = useState<string>();

  const metaData = useMemo(() => {
    return {
      id,
      name,
      description,
      image,
      head,
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
  }, [id, name, description, image, head, birthday]);

  const updateStoreKey = (key: string) => {
    localStorage.setItem(STORE_KEY, key);
    setStoreKey(key);
  };

  const updateBirthday = (value: string = '') => {
    const timestamp = Math.floor(new Date(value + ':00.000Z').getTime() / 1000);
    setId(timestamp.toString());
    setBirthday(timestamp);
  };

  const updateName = (value: string = '') => {
    const v = value.trim();
    const n = v
      .trim()
      .split(' ')
      .join('')
      .toLowerCase();
    setName(n);
    setDescription(`${n} token`);
  };

  const onPreloadIpfs = async (e: FormEvent) => {
    e && e.preventDefault();
    try {
      const {id, name, description, image, head, attributes} = await api(
        `${ENDPOINT.ipfs}/${preloadIpfs}`
      );
      setId(id);
      setName(name);
      setDescription(description);
      setImage(image);
      setHead(head);
      setBirthday(attributes?.[0].value);
    } catch (e) {
      console.log(e);
    }
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

  const udpateDbResult = (res: any) => {
    setDbResult(res);
    setDbResultAsText(JSON.stringify(res, null, 2));
  };

  const onDbSave = async () => {
    let body;
    if (dbResultAsText) {
      body = JSON.parse(dbResultAsText)?.star;
    } else if (ipfs && metaData) {
      body = {
        id: metaData.id,
        name: metaData.name,
        ipfs,
      };
    }
    if (body && body.id && body.name && body.ipfs) {
      const res = await post(ENDPOINT.token.index, body);
      udpateDbResult(res);
    }
  };

  const onDbSearch = async (e: FormEvent) => {
    e && e.preventDefault();
    try {
      const res = await api(`${ENDPOINT.token.index}?id=${dbSearch}`);
      udpateDbResult(res);
    } catch (e) {
      console.log(e);
    }
  };

  const isReady = !!(storeKey && id && name && description && image && head && birthday);

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
            css={{p: '$10'}}
            value={storeKey}
            type={storeKeyType}
            onFocus={() => setStoreKeyType('text')}
            onBlur={() => setStoreKeyType('password')}
            onChange={e => updateStoreKey(e?.target?.value || '')}
          />

          {!ipfs && (
            <>
              <div style={{float: 'right'}}>
                preload:{' '}
                <form onSubmit={onPreloadIpfs}>
                  <input
                    placeholder="ipfs"
                    onChange={e => setPreloadIpfs(e?.target?.value || '')}
                  />
                </form>
              </div>
              <form onSubmit={onSubmit}>
                <div>
                  birthday:{' '}
                  <input
                    required
                    type="datetime-local"
                    value={birthday ? new Date(birthday * 1000).toISOString().slice(0, 16) : ''}
                    onChange={e => updateBirthday(e.target.value)}
                  />
                </div>
                <div>
                  name: <input required value={name} onChange={e => updateName(e.target.value)} />
                </div>
                <pre>{JSON.stringify(metaData, null, 2)}</pre>
                <button type="submit" disabled={!isReady} style={isReady ? {color: 'gold'} : {}}>
                  Submit
                </button>
              </form>
            </>
          )}

          {ipfs && (
            <>
              <a href={`${ENDPOINT.ipfs}/${ipfs}`} target="_blank" rel="noreferrer">
                {ipfs}
              </a>
              <div>
                <button onClick={() => setIpfs(undefined)}>Reset</button>
              </div>
            </>
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
              <button onClick={onDbSave} style={{color: 'gold'}}>
                Save
              </button>
            </div>
          )}
          {!ipfs && (
            <div>
              <form onSubmit={onDbSearch}>
                <Input
                  underlined
                  placeholder="Search"
                  onChange={e => setDbSearch(e?.target?.value || '')}
                />
              </form>
            </div>
          )}
          {dbResult && (
            <div>
              <div>
                <textarea
                  value={dbResultAsText}
                  onChange={e => setDbResultAsText(e.target.value)}
                  style={{width: '100%', height: '300px'}}
                />
              </div>
              <button onClick={() => udpateDbResult(undefined)}>Reset</button>
              {dbResultAsText !== JSON.stringify(dbResult, null, 2) && (
                <button onClick={onDbSave} style={{color: 'gold'}}>
                  Save
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
