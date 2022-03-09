import type { NextPage, NextPageContext } from 'next';
import { isAdmin } from '../hooks/route';

const Admin: NextPage = () => {
    return <div>Admin only</div>;
};

export async function getServerSideProps(ctx: NextPageContext) {
    const admin = isAdmin({ ctx });
    return { props: { admin } };
}

export default Admin;
