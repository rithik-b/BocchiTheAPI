FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["BocchiTheAPI.Silo/BocchiTheAPI.Silo.csproj", "BocchiTheAPI.Silo/"]
RUN dotnet restore "BocchiTheAPI.Silo/BocchiTheAPI.Silo.csproj"
COPY . .
WORKDIR "/src/BocchiTheAPI.Silo"
RUN dotnet build "BocchiTheAPI.Silo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BocchiTheAPI.Silo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BocchiTheAPI.Silo.dll"]
