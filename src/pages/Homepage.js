import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const REVIEWS = gql`
  query GetReviews {
    reviews {
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

export default function Homepage() {
  const { loading, error, data } = useQuery(REVIEWS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  const reviews = data.reviews.data || [];

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="rating">{review.attributes.rating}</div>
          <h2>{review.attributes.title}</h2>
          {review.attributes.categories.data.map((c) => (
            <small key={c.id}>{c.attributes.name}</small>
          ))}
          <p>
            {review.attributes.body
              .map((paragraph) =>
                paragraph.children.map((text) => text.text).join(" "),
              )
              .join(" ")
              .substring(0, 200)}
            ...
          </p>
          <Link to={`/details/${review.id}`}>Read more...</Link>
        </div>
      ))}
    </div>
  );
}
