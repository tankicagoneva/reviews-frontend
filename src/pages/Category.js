import React from "react";
import { useQuery, gql } from "@apollo/client";

import { useParams, Link } from "react-router-dom";



const CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      data {
        id
        attributes {
          name
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
      }
    }
  }
`;

export default function Category() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(CATEGORY, {
    variables: { id: id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  const category = data.category.data;

  return (
    <div>
      <h2>{category.attributes.name}</h2>
      {category.attributes.reviews.data.map((review) => (
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
