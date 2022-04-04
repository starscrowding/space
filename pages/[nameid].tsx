import { NextPageContext } from 'next';
import Error from 'next/error';
import { Loading } from "@nextui-org/react";
import { Stars } from '@space/hooks/db';
import { useStar } from '@space/hooks/store';
import { Token } from '@space/components/Token';
import styles from '../styles/token.module.scss';

interface PageContext {
    ipfs: string;
    iframe: boolean;
}

const TokenPageContent = ({ ipfs }: PageContext) => {
    const { star, error, loading } = useStar(ipfs);
    if (error) {
        return <Error statusCode={400} />;
    }
    if (loading) {
        return <div className={styles.loading}><Loading type="gradient" color="white" /></div>;
    }
    return (<div>
        <Token dataUrl={star?.head} style={{ position: 'fixed', top: '0', bottom: '0', left: '0', right: '0' }} />
    </div>);
};

const TokenPage = (ctx: PageContext) => {
    const { ipfs } = ctx;
    if (!ipfs) {
        return <Error statusCode={404} />;
    }
    return <TokenPageContent {...ctx} />;
}

export async function getServerSideProps(context: NextPageContext) {
    try {
        const { nameid } = context?.query;
        const split = (nameid as string).split('*');
        const [name, id] = [split.shift(), split.join('')];
        const star = await Stars.findOne({ name, id });
        return {
            props: {
                ipfs: star?.ipfs || null,
                iframe: context?.query?.i === '1'
            },
        }
    } catch (e) {
        console.error(e);
        return {
            props: { ipfs: null },
        }
    }
}

export default TokenPage;
