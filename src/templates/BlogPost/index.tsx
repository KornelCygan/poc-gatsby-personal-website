import React from 'react';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';

import * as Styled from './styles';

interface paragraphContent {
  id: string,
  paragraphContent: string,
};

interface headingContent {
  id: string,
  headingContent: string,
};

interface imageContent {
  id: string,
  imageContent: any,
}

interface Post  {
  nodes: [
    {title: string,
    date: string,
    slug: string,
    content: Array<paragraphContent | headingContent | imageContent>}
  ]
}

interface Props {
  data: {
    allDatoCmsArticle: Post;
  };
  pageContext: {
    slug: string;
    next: Post;
    previous: Post;
  };
}

const BlogPost: React.FC<Props> = ({ data, pageContext }) => {
  const post = data.allDatoCmsArticle.nodes[0];
  const { previous, next } = pageContext;
  console.log('dataaaaaaa',data)

  return (
    <Layout>
      <SEO title={post.title} />
      <Container section>
        <TitleSection title={post.date} subtitle={post.title} />
        <div>{post.content.map(item => {
          const itemKey = Object.keys(item)[2]

          switch (itemKey) {
            case 'paragraphContent':
              return <p key={item.id}>{item[itemKey]}</p>;
            case 'headingContent':
              return <h2 key={item.id}>{item[itemKey]}</h2>;
            case 'imageContent':
              return <img key={item.id} src={item[itemKey].url}/>
          }
        })}</div>
        <Styled.Links>
          <span>
            {previous && (
              <Link to={previous.nodes[0].slug} rel="previous">
                ← {previous.nodes[0].title}
              </Link>
            )}
          </span>
          <span>
            {next && (
              <Link to={next.nodes[0].slug} rel="next">
                {next.nodes[0].title} →
              </Link>
            )}
          </span>
        </Styled.Links>
      </Container>
    </Layout>
  );
};

export default BlogPost;

export const query = graphql`
query BlogPostBySlug($slug: String!) {
  allDatoCmsArticle(filter: {slug: {eq: $slug}}) {
    nodes {
      title
      date
      slug
      content {
        ... on DatoCmsArticleImage {
          id
          imageContent {
            url
          }
        }
        ... on DatoCmsHeading {
          id
          headingContent
        }
        ... on DatoCmsParagraph {
          id
          paragraphContent
        }
      }
    }
  }
}
`;
