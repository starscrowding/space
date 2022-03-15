import type { NextPage, NextPageContext } from 'next';
import { isAdmin } from '../hooks/route';
import { MintToken } from '../components/Token';

const Admin: NextPage = () => {
    return <div>
        <div>Admin only</div>

        <MintToken />
    </div>;
};

export async function getServerSideProps(ctx: NextPageContext) {
    const admin = isAdmin({ ctx });
    return { props: { admin } };
}

export default Admin;
