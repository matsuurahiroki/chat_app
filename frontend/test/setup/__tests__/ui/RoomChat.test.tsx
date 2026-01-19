// test/setup/__tests__/ui/RoomChat.test.tsx
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoomChat from "@/app/components/RoomChat";
import { renderWithProviders } from "../../../render";
import { useSession } from "next-auth/react";

const makeJsonResponse = (data: unknown, status = 200) => {
  const body = JSON.stringify(data);

  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => body,
    json: async () => (body ? JSON.parse(body) : null),
    headers: {
      get: (key: string) =>
        key.toLowerCase() === "content-type" ? "application/json" : null,
    },
  };
};

jest.mock("next-auth/react", () => {
  const actual = jest.requireActual("next-auth/react");
  return {
    ...actual,
    useSession: jest.fn(),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/rooms/1",
  useSearchParams: () => new URLSearchParams(),
}));

const useSessionMock = useSession as unknown as jest.Mock;

describe("RoomChat", () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({
      data: {
        userId: 1,
        user: { id: "1", name: "TestUser", email: "test@example.com" },
        expires: new Date(Date.now() + 60_000).toISOString(),
      },
      status: "authenticated",
    });

    const messages = [
      {
        id: 10,
        body: "hello",
        room_id: 1,
        user_id: 1,
        created_at: new Date().toISOString(),
        user: { id: 1, name: "TestUser" },
      },
    ];

    const created = {
      id: 11,
      body: "new message",
      room_id: 1,
      user_id: 1,
      created_at: new Date().toISOString(),
      user: { id: 1, name: "TestUser" },
    };

    const fetchMock = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = (init?.method ?? "GET").toUpperCase();

        // 初回ロード: メッセージ一覧
        if (method === "GET" && url.includes("/api/bff/messages")) {
          return makeJsonResponse(messages, 200);
        }

        if (method === "POST" && url.includes("/api/bff/messages")) {
          messages.push(created);
          return makeJsonResponse(created, 201);
        }

        // 送信: 作成
        if (method === "POST" && url.includes("/api/bff/messages")) {
          // 送信後に UI が再取得する可能性があるので、次回 GET を新しい一覧にしておく
          messages.push(created);
          return makeJsonResponse(created, 201);
        }

        return makeJsonResponse({ error: 'unexpected_fetch' }, 500)
      },
    );

    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("loads and renders messages", async () => {
    renderWithProviders(
      <RoomChat
        roomId={1}
        roomTitle={"bbhbbh"}
        roomTime={"2026-01-18T00:00:00.000Z"}
        userName={"jjjj"}
      />,
    );

    expect(await screen.findByText("hello")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("posts a message", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <RoomChat
        roomId={1}
        roomTitle={"あああ"}
        roomTime={"2026-01-18T00:00:00.000Z"}
        userName={"aaaa"}
      />,
    );

    // 入力（textarea / input のどちらでも role は textbox になる想定）
    const textbox = await screen.findByRole("textbox");
    await user.type(textbox, "new message");

    // ボタン名が違う場合はここだけ調整してください（例: '送信' / '投稿'）
    const sendButton =
      screen.queryByRole("button", { name: /send|送信|投稿/i }) ??
      screen.getAllByRole("button")[0];

    await user.click(sendButton);

    await waitFor(() => {
      // POST が飛んでいること（URL は roomId を query で持つ実装が多い）
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/bff\/messages/),
        expect.objectContaining({ method: "POST" }),
      );
    });

    // 画面に反映されること（append でも再取得でもOK）
    expect(await screen.findByText("new message")).toBeInTheDocument();
  });
});
