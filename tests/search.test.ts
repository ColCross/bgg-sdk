import axios from "axios";
import { search } from "../src/routes/search";

jest.mock("axios");

describe("search", () => {
  it("should return an empty array if no items are found", async () => {
    const args = {
      /* provide your test arguments here */
    };
    const response = {
      data: {
        items: {
          item: undefined,
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(response);

    const result = await search(args);

    expect(result).toEqual([]);
  });

  it("should return an array of transformed items", async () => {
    const args = {
      /* provide your test arguments here */
    };
    const response = {
      data: {
        items: {
          item: [
            {
              /* provide your test data here */
            },
            {
              /* provide your test data here */
            },
          ],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(response);

    const result = await search(args);

    expect(result).toEqual([
      {
        /* provide your expected transformed data here */
      },
      {
        /* provide your expected transformed data here */
      },
    ]);
  });
});
