import { ClientNotFoundError } from "@workspace/domain";
import { describe, expect, test } from "vitest";

import { FakeClientRepository } from "@/fakes/client/client.fake";
import {
  CreateClientUseCase,
  DeleteClientUseCase,
  GetClientUseCase,
  ListClientsUseCase,
  UpdateClientUseCase
} from "@/use-cases/client/client.use-case";

const restaurantId = "11111111-1111-1111-1111-111111111111";

const buildRepo = (): FakeClientRepository => new FakeClientRepository();

describe("Client use-cases", () => {
  test("create then get", async () => {
    const repo = buildRepo();
    const created = await new CreateClientUseCase(repo).execute({
      restaurantId,
      firstName: "Anne",
      lastName: "Martin"
    });

    const fetched = await new GetClientUseCase(repo).execute({ id: created.id });

    expect(fetched.firstName).toBe("Anne");
  });

  test("list returns paginated", async () => {
    const repo = buildRepo();
    const create = new CreateClientUseCase(repo);

    await create.execute({ restaurantId, firstName: "A", lastName: "B" });
    await create.execute({ restaurantId, firstName: "C", lastName: "D" });

    const result = await new ListClientsUseCase(repo).execute({ restaurantId, page: 1, limit: 10 });

    expect(result.total).toBe(2);
    expect(result.data).toHaveLength(2);
  });

  test("update", async () => {
    const repo = buildRepo();
    const created = await new CreateClientUseCase(repo).execute({
      restaurantId,
      firstName: "X",
      lastName: "Y"
    });

    const updated = await new UpdateClientUseCase(repo).execute({
      id: created.id,
      firstName: "Z",
      lastName: "Y"
    });

    expect(updated.firstName).toBe("Z");
  });

  test("delete then get throws", async () => {
    const repo = buildRepo();
    const created = await new CreateClientUseCase(repo).execute({
      restaurantId,
      firstName: "X",
      lastName: "Y"
    });

    await new DeleteClientUseCase(repo).execute({ id: created.id });

    await expect(new GetClientUseCase(repo).execute({ id: created.id })).rejects.toBeInstanceOf(ClientNotFoundError);
  });
});
