import type { CoursePart } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  const boldName = (
    <strong>
      {part.name} {part.exerciseCount}
    </strong>
  );

  switch (part.kind) {
    case "basic":
      return (
        <p>
          {boldName}
          <br />
          <em>{part.description}</em>
        </p>
      );
    case "group":
      return (
        <p>
          {boldName}
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          {boldName}
          <br />
          <em>{part.description}</em>
          <br />
          submit to {part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          {boldName}
          <br />
          <em>{part.description}</em>
          <br />
          required skills: {part.requirements.join(", ")}
        </p>
      );
    default:
      return assertNever(part); // Comprobación exhaustiva
  }
};

export default Part;
