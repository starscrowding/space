import { useState, useMemo, FormEvent } from 'react';
import { NFTStorage } from 'nft.storage';
import { Input } from '@nextui-org/react';
import { BASE } from '@space/hooks/api';

interface StoreTokenProps {
    meta: {
        image: string,
        head: string,
    }
    onNext?(): void
}

export const StoreToken = ({ meta }: StoreTokenProps) => {
    const STORE_KEY = 'STORE_KEY';
    const [storeKey, setStoreKey] = useState<string>(
        localStorage.getItem(STORE_KEY) as string
    );
    const [storeKeyType, setStoreKeyType] = useState<string>('password');
    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [birthday, setBirthday] = useState<number>();

    const metaData = useMemo(() => {
        return {
            id,
            name,
            description,
            image: meta?.image,
            head: meta?.head,
            external_url: `${BASE}/${name}*${id}`,
            attributes: [
                {
                    display_type: 'date',
                    trait_type: 'birthday',
                    value: birthday
                }
            ]
        }
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

    const onSubmit = (e: FormEvent) => {
        e && e.preventDefault();
        console.log(metaData);
    }

    const isReady = !!(storeKey && meta?.image && meta?.head && name && id && description && birthday);

    return (<div>
        <Input id="store-key"
            placeholder="Store key"
            bordered
            width="100%"
            css={{ p: '$10' }}
            value={storeKey}
            type={storeKeyType}
            onFocus={() => setStoreKeyType('text')}
            onBlur={() => setStoreKeyType('password')}
            onChange={e => updateStoreKey(e?.target?.value || '')} />

        <form onSubmit={onSubmit}>
            <div>birthday: <input required type="datetime-local" onChange={e => updateBirthday(e.target.value)} /></div>
            <div>name: <input required onChange={e => updateName(e.target.value)} /></div>
            <pre>{JSON.stringify(metaData, null, 2)}</pre>
            <button type="submit" disabled={!isReady} style={isReady ? { color: 'green' } : {}}>Submit</button>
        </form>
    </div>);
}
