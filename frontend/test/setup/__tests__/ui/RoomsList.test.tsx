// test/__tests__/ui/RoomsList.test.tsx
import { screen } from "@testing-library/react";
import RoomsList from "@/app/components/RoomsList";
import { renderWithProviders } from "@/../test/render";
import { useSession } from "next-auth/react";

jest.mock('next-auth/react', () => {
  const actual = jest.requireActual('next-auth/react')
  return {
    ...actual,
    useSession: jest.fn(),
  }
})

const useSessionMock = useSession as jest.Mock;

describe("RoomsList", () => {
  it("renders room titles", () => {
    useSessionMock.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    renderWithProviders(
      <RoomsList
        rooms={[
          {
            id: 1,
            title: "room-a",
            user_id: 1,
            created_at: "2026-01-18T00:00:00.000Z",
            user: { id: 1, name: "u" },
          },
        ]}
      />,
    );

    expect(screen.getByText("room-a")).toBeInTheDocument();
  });
});
