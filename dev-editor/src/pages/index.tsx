import _ from 'lodash';
import Link from 'next/link';
import { TCourse } from '@agorapp-dao/content-common';
import { courseService } from '@agorapp-dao/editor-common';
import { List, ListItem } from '@mui/material';
import { contentService } from '@agorapp-dao/content-common/src/services/contentService';

courseService.baseUrl = '/course';

type IndexPageProps = {
  contentPackages: TCourse[];
};

export default function IndexPage({ contentPackages }: IndexPageProps) {
  const groups = _.groupBy(contentPackages, pkg => `${pkg.chain}/${pkg.language}`);

  return (
    <div style={{ padding: '10px 20px' }}>
      {Object.keys(groups).map(group => (
        <div key={group}>
          <h4>{group}</h4>
          <List>
            {groups[group].map(contentPkg => (
              <ListItem key={contentPkg.slug}>
                <Link href={`${courseService.getCoursePath(contentPkg)}`}>{contentPkg.slug}</Link>
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  let contentPackages = await contentService.listContentPackages();

  return { props: { contentPackages } };
}
