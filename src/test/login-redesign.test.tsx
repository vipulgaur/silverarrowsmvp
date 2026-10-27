import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children, to, className, ...props }: any) => (
      <a href={typeof to === "string" ? to : "#"} className={className} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  };
});

import { Route } from "@/routes/login";
import { FIXED_TESTING_PASSWORD, TESTING_USERS } from "@/routes/login";
import { StoreProvider } from "@/lib/store";
import { readDemoData } from "@/lib/demo-storage";

function renderLoginPage() {
  const Component = Route.options.component!;
  return render(
    <StoreProvider>
      <Component />
    </StoreProvider>,
  );
}

describe("REDESIGNED CENTERED PORTAL SIGN IN & ACCOUNT REGISTRATION", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("maintains the controlled testing users directory with {firstname}@flysilverarrows.com and private password", () => {
    expect(FIXED_TESTING_PASSWORD).toBe("Vipul@1011");

    // Admin
    const admin = TESTING_USERS.find((u) => u.name === "Sakshi Gaur");
    expect(admin).toBeDefined();
    expect(admin?.email).toBe("sakshi@flysilverarrows.com");
    expect(admin?.role).toBe("admin");

    // Chief CFI
    const cfi = TESTING_USERS.find((u) => u.name === "Vipul Aviation");
    expect(cfi).toBeDefined();
    expect(cfi?.email).toBe("vipul@flysilverarrows.com");
    expect(cfi?.role).toBe("instructor");

    // Flight Instructor
    const priya = TESTING_USERS.find((u) => u.name === "Priya Nair");
    expect(priya).toBeDefined();
    expect(priya?.email).toBe("priya@flysilverarrows.com");
    expect(priya?.role).toBe("instructor");

    // Ground Instructor
    const anujay = TESTING_USERS.find((u) => u.name === "Anujay Singh");
    expect(anujay).toBeDefined();
    expect(anujay?.email).toBe("anujay@flysilverarrows.com");
    expect(anujay?.role).toBe("ground");

    // Student Pilots
    const ananya = TESTING_USERS.find((u) => u.name === "Ananya Sharma");
    expect(ananya).toBeDefined();
    expect(ananya?.email).toBe("ananya@flysilverarrows.com");
    expect(ananya?.role).toBe("student");

    const aarav = TESTING_USERS.find((u) => u.name === "Aarav Patel");
    expect(aarav).toBeDefined();
    expect(aarav?.email).toBe("aarav@flysilverarrows.com");
    expect(aarav?.role).toBe("student");

    const liam = TESTING_USERS.find((u) => u.name === "Liam Nielsen");
    expect(liam).toBeDefined();
    expect(liam?.email).toBe("liam@flysilverarrows.com");
    expect(liam?.role).toBe("student");
  });

  it("renders the centered Portal Sign In box, removes the left testing roster box, and never leaks the password on screen", () => {
    const { container } = renderLoginPage();

    // The left testing roster box must be removed
    expect(screen.queryByTestId("testing-roster-section")).toBeNull();
    expect(screen.queryByText(/Controlled Testing Environment/i)).toBeNull();
    expect(screen.queryByText(/Canonical Testing Credentials/i)).toBeNull();

    // The centered auth console is present
    expect(screen.getByTestId("auth-console-section")).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Portal Sign In/i })).toBeTruthy();

    // Password must NEVER be displayed or leaked in text on screen
    expect(container.textContent).not.toContain("Vipul@1011");
    expect(screen.queryByText("Vipul@1011")).toBeNull();
  });

  it("selects a user from the Quick Login dropdown, displays their profile badge without exposing password, and challenges for password", async () => {
    const { container } = renderLoginPage();

    const select = screen.getByTestId("quick-persona-select") as HTMLSelectElement;
    expect(select).toBeTruthy();

    // Select Ananya Sharma from the dropdown
    fireEvent.change(select, { target: { value: "u-ana" } });

    // Verify email is filled
    const emailInput = container.querySelector("#email") as HTMLInputElement;
    expect(emailInput.value).toBe("ananya@flysilverarrows.com");

    // Verify selected persona callout appears, but NEVER displays the password
    expect(screen.getByTestId("selected-persona-badge")).toBeTruthy();
    expect(screen.getByTestId("selected-persona-badge").textContent).toContain("Ananya Sharma");
    expect(screen.getByTestId("selected-persona-badge").textContent).not.toContain("Vipul@1011");
    expect(container.textContent).not.toContain("Vipul@1011");

    // Entering a wrong password rejects authentication
    const passwordInput = container.querySelector("#password") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.submit(container.querySelector("form")!);

    // Filling the secret testing password allows successful login
    fireEvent.change(passwordInput, { target: { value: "Vipul@1011" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      const { data } = readDemoData();
      const existing = data.users.find((u) => u.email === "ananya@flysilverarrows.com");
      expect(existing).toBeDefined();
      expect(existing?.name).toBe("Ananya Sharma");
    });
  });

  it("switches to Create New Account mode and registers a new member entry in the database table", async () => {
    const { container } = renderLoginPage();

    // Switch to Register mode
    fireEvent.click(screen.getByTestId("mode-tab-signup"));

    // Fill form
    const firstNameInput = container.querySelector("#firstName") as HTMLInputElement;
    const lastNameInput = container.querySelector("#lastName") as HTMLInputElement;
    const emailInput = container.querySelector("#signupEmail") as HTMLInputElement;
    const passwordInput = container.querySelector("#signupPassword") as HTMLInputElement;
    const verifyInput = container.querySelector("#verifyPassword") as HTMLInputElement;

    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(verifyInput).toBeTruthy();

    // Verify no password is leaked in placeholder or text
    expect(container.textContent).not.toContain("Vipul@1011");
    expect(passwordInput.placeholder).not.toContain("Vipul@1011");

    fireEvent.change(firstNameInput, { target: { value: "Kabir" } });
    fireEvent.change(lastNameInput, { target: { value: "Mehta" } });
    fireEvent.change(emailInput, { target: { value: "kabir@flysilverarrows.com" } });
    fireEvent.change(passwordInput, { target: { value: "Vipul@1011" } });
    fireEvent.change(verifyInput, { target: { value: "Vipul@1011" } });

    // Submit registration
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(
      () => {
        const { data } = readDemoData();
        const registered = data.users.find((u) => u.email === "kabir@flysilverarrows.com");
        expect(registered).toBeDefined();
        expect(registered?.name).toBe("Kabir Mehta");
        expect(registered?.role).toBe("student");
        expect(registered?.status).toBe("active");
      },
      { timeout: 4000 },
    );
  });

  it("renders a landscape rectangle card (width > length), bold theme-based title, and animated sky background with clouds and airplane", () => {
    const { container } = renderLoginPage();

    // Verify main card has landscape width constraint max-w-[840px]
    const mainBox = container.querySelector("main");
    expect(mainBox?.className).toContain("max-w-[840px]");

    // Verify section card has consistent min-height
    const cardSection = screen.getByTestId("auth-console-section");
    expect(cardSection.className).toContain("min-h-[500px]");

    // Verify Title is bold and theme-based
    const heading = screen.getByRole("heading", { name: /Portal Sign In/i });
    expect(heading.className).toContain("font-extrabold");
    expect(heading.className).toContain("text-primary");

    // Verify Mode Switcher Pill Control
    expect(screen.getByTestId("mode-tab-signin")).toBeTruthy();
    expect(screen.getByTestId("mode-tab-signup")).toBeTruthy();

    // Verify interactive sky background with Cessna 172, clouds, trees and runway is present
    const skyBackground = container.querySelector("div[aria-hidden='true']");
    expect(skyBackground).toBeTruthy();
    expect(container.innerHTML).toContain("cessna-propeller-spin");
    expect(container.innerHTML).toContain("cessna-wing-strobe");
    expect(container.innerHTML).toContain("cessnaWarmHeadlightBeam");
    expect(container.innerHTML).toContain("cloud-drift-track");
    expect(container.innerHTML).toContain("27L"); // Runway identifier
    expect(container.innerHTML).toContain("SA TWR"); // Air Traffic Control Tower callsign
    expect(screen.getByTestId("atc-tower")).toBeTruthy();

    // Verify Token Collector & Waypoint Scout Mini-Game & HUD
    expect(screen.getAllByTestId("sky-collectable-wing").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("sky-collectable-waypoint").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("sky-collectable-fuel").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Flight Scout HUD")).toBeTruthy();
    expect(container.innerHTML).toContain("FLIGHT SCOUT · C172S");
    expect(container.innerHTML).toContain("FUEL RESERVE");
    expect(container.innerHTML).toContain("STUDENT PILOT");
  });
});
