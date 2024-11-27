import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResultsList({ results }) {

    const navigateTo = useNavigate()

    return (
      <ul>
        {results.map((item, index) => (
          <button onClick={() => navigateTo(`community/${item.id}`)} key={index}>
            <li key={index}>
              {item.name}
            </li>
          </button>
        ))}
      </ul>
    );
  }
  
  export default ResultsList;