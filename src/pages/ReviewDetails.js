import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import ReactMarkdown from "react-markdown";

const REVIEW = gql`
  query GetReviews($id: ID!) {
    review(id: $id) {
      data {
        id
        attributes {
          title
          rating
          body
          categories {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;



export default function ReviewDetails() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(REVIEW, {
    variables: { id: id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  const reviewData = data.review.data;

  return (
    <div className="review-card">
      <div className="rating">{reviewData.attributes.rating}</div>
      <h2>{reviewData.attributes.title}</h2>

      {reviewData.attributes.categories.data.map((c) => (
        <small key={c.id}>{c.attributes.name}</small>
      ))}

      <ReactMarkdown>
        {reviewData.attributes.body.map((node) => {
      if (node.type === 'paragraph') {
        return node.children.map((child) => child.text).join(' ');
      } else if (node.type === 'image') {
        const imageUrl = node.image.url;
        const altText = node.image.alternativeText || 'Image';
        return `![${altText}](${imageUrl})`; 
      }
      return '';
    })
    .join('\n\n')}
      </ReactMarkdown>
    </div>
  );
}
