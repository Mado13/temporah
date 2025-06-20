defmodule Tempi.MixProject do
  use Mix.Project

  def project do
    [
      app: :tempi,
      version: "0.1.0",
      elixir: "~> 1.18.3",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      consolidate_protocols: Mix.env() != :dev,
      aliases: aliases(),
      deps: deps(),
      releases: [
        tempi: [
          applications: [
            certifi: :permanent
          ]
        ]
      ]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Tempi.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.

  defp elixirc_paths(:test) do
    ["lib", "test/support"]
  end

  defp elixirc_paths(_) do
    ["lib"]
  end

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:bandit, "~> 1.5"},
      {:bcrypt_elixir, "~> 3.0"},
      {:bun, "~> 1.4"},
      {:dns_cluster, "~> 0.2.0"},
      {:certifi, "~> 2.15.0"},
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:ecto_sql, "~> 3.10"},
      {:ex_phone_number, "~> 0.4.5"},
      {:ex_twilio, "~> 0.10.0"},
      {:finch, "~> 0.13"},
      {:floki, "~> 0.37.0"},
      {:geo_postgis, "~> 3.7"},
      {:gettext, "~> 0.26"},
      {:igniter, "~> 0.5", only: [:dev, :test]},
      {:inertia, "~> 2.4.0"},
      {:jason, "~> 1.2"},
      {:nimble_csv, "~> 1.2"},
      {:phoenix, "~> 1.7.20"},
      {:phoenix_ecto, "~> 4.5"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 4.1"},
      {:phoenix_live_reload, "~> 1.4", only: :dev},
      {:phoenix_live_view, "~> 1.0.0"},
      {:recase, "~> 0.8.1"},
      {:redix, "~> 1.5.2"},
      {:sobelow, "~> 0.13", only: [:dev, :test], runtime: false},
      {:swoosh, "~> 1.5"},
      {:timex, "~> 3.7"},
      {:tidewave, "~> 0.1", only: :dev},
      {:tz, "~> 0.28"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "assets.setup", "assets.build"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "assets.setup": ["cmd bun install"],
      "assets.build": ["cmd bun run --filter frontend build"],
      "assets.deploy": [
        "cmd BUN_INSTALL_PRODUCTION=true bun install --no-progress",
        "cmd bun run --filter frontend build",
        "phx.digest"
      ]
    ]
  end
end
