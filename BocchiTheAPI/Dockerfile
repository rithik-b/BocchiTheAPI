FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["BocchiTheAPI/BocchiTheAPI.csproj", "BocchiTheAPI/"]
RUN dotnet restore "BocchiTheAPI/BocchiTheAPI.csproj"
COPY . .
WORKDIR "/src/BocchiTheAPI"
RUN dotnet build "BocchiTheAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BocchiTheAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BocchiTheAPI.dll"]
