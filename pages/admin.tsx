import { useEffect, useState } from 'react';
import { NextPage, NextPageContext } from 'next';
import Image from 'next/image';
import { Text } from '@nextui-org/react';
import { isAdmin } from '@space/hooks/route';
import { MintToken } from '@space/components/Token';
import { StoreToken } from '@space/components/Token';

const Admin: NextPage = () => {
    const [step, setStep] = useState('');
    const [mintMeta, setMintMeta] = useState<{ head: string, image: string }>();

    const updateStep = (nextStep: string) => {
        setStep(nextStep);
        window.location.hash = nextStep;
    };

    useEffect(() => {
        const hash = window?.location?.hash;
        if (hash) {
            setStep(hash.substring(1));
        }
    }, []);

    return (<div>
        <div><Text color='primary' weight={'bold'}>Admin only</Text></div>

        <div>
            <button onClick={() => updateStep('mint')}>Mint</button>
            <button onClick={() => updateStep('store')}>Store</button>
        </div>

        {step === 'mint' && <>
            {!mintMeta && <MintToken onNext={setMintMeta} />}

            {mintMeta && <div>
                Head: <Image src={mintMeta.head} alt="head" width={300} height={300} />
                Image: <Image src={mintMeta.image} alt="image" width={300} height={300} />
            </div>}
        </>}

        {step === 'store' && <StoreToken meta={mintMeta} />}
    </div>);
};

export async function getServerSideProps(ctx: NextPageContext) {
    const admin = isAdmin({ ctx });
    return { props: { admin } };
}

export default Admin;
