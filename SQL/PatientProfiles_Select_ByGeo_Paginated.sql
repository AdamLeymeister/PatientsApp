USE [MiVet]
GO

/****** Object:  StoredProcedure [dbo].[Patients_Select_ByGeo]    Script Date: 11/9/2022 3:12:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Adam Leymeister
-- Create date: 10/10/2022
-- Description: Patient Select By Geo
-- Code Reviewer:
-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================
ALTER PROC [dbo].[Patients_Select_ByGeo] @UserId INT
	,@PageIndex INT
	,@PageSize INT
AS
/*
DECLARE @UserId int = 75
		,@PageIndex int = 0
		,@PageSize int = 5

EXECUTE [dbo].[Patients_Select_ByGeo]
			@UserId
			,@PageIndex
			,@PageSize
*/
BEGIN
	DECLARE @offset INT = @PageIndex * @PageSize
	DECLARE @lat FLOAT
	DECLARE @lng FLOAT

	SET @lat = (
			SELECT TOP 1 l.Latitude
			FROM dbo.users u
			INNER JOIN dbo.Appointments a ON u.id = a.CreatedBy
			INNER JOIN dbo.Locations l ON u.Id = l.CreatedBy
			WHERE u.id = @UserId
				AND l.Latitude IS NOT NULL
				AND l.Longitude IS NOT NULL
			ORDER BY l.DateCreated DESC
			);
	SET @lng = (
			SELECT TOP 1 l.Longitude
			FROM dbo.users u
			INNER JOIN dbo.Appointments a ON u.id = a.CreatedBy
			INNER JOIN dbo.Locations l ON u.Id = l.CreatedBy
			WHERE u.id = @UserId
				AND l.Latitude IS NOT NULL
				AND l.Longitude IS NOT NULL
			ORDER BY l.DateCreated DESC
			);

	WITH AllRecords
	AS (
		SELECT DISTINCT [l].[Id] AS LocationId
			,[lt].[Id] AS LocationTypeId
			,[lt].[Name] AS LocationTypeName
			,[l].[LineOne]
			,[l].[LineTwo]
			,[l].[City]
			,[l].[Zip]
			,[s].[Id] AS StateId
			,[s].[Name] AS StateName
			,[l].[Latitude]
			,[l].[Longitude]
			,[l].[DateCreated]
			,[l].[DateModified]
			,[l].[CreatedBy]
			,[l].[ModifiedBy]
			,[h].[Name] AS PatientName
			,[h].[Id] AS PatientId
			,[h].[BreedTypeId] AS PatientBreedTypeId
			,[b].[Name] AS PatientBreedName
			,[h].[Age] AS PatientAge
			,[h].[Color] PatientColor
			,[h].[HasConsent] AS PatientHasConsent
			,[h].[IsFemale] AS PatientIsFemale
			,[h].[PrimaryImageUrl] AS PatientPrimaryImageUrl
			,[h].[PrimaryImageUrl] AS PatientAvatar
			,[h].[Weight] AS PatientWeight
			,u.Id AS OwnerId
			,[u].[Email] AS OwnerEmail
			,[u].[Title] AS OwnerTitle
			,[u].[FirstName] AS OwnerFirstName
			,[u].[LastName] AS OwnerLastName
			,[u].Mi AS OwnerMiddleInitial
			,[u].[AvatarUrl] AS OwnerAvatarUrl
			,u.IsConfirmed AS OwnerIsConfirmed
			,u.StatusTypeId AS OwnerStatusTypeId
			,u.DateCreated AS OwnerDateCreated
			,u.DateModified AS OwnerDateModified
			,Users = (
				SELECT DISTINCT u.FirstName
					,u.LastName
					,u.AvatarUrl
					,u.Email
				FROM dbo.[Users] usr
				INNER JOIN dbo.UserHorses uh ON uh.UserId = usr.Id
				WHERE uh.HorseProfileId = h.Id
				FOR JSON AUTO
				)
			,Medications = (
				SELECT m.Name
					,m.Manufacturer
					,hm.Dosage
					,hm.DosageUnit
					,hm.NumberDoses
					,hm.Frequency
					,StartDate = GetUtcDate()
				FROM dbo.Medications m
				INNER JOIN dbo.HorseMedications hm ON hm.MedicationId = m.Id
				WHERE hm.HorseProfileId = h.Id
				FOR JSON PATH
				)
			,Files = (
				SELECT DISTINCT f.[Name]
					,f.[Name]
					,f.[Url]
				FROM dbo.Files f
				INNER JOIN dbo.HorseFiles hf ON hf.FileId = f.Id
				WHERE hf.HorseProfileId = h.Id
				FOR JSON AUTO
				)
			,distance = (3959.0 * acos(cos(radians(@lat)) * cos(radians([l].[Latitude])) * cos(radians([l].[Longitude]) - radians(@lng)) + sin(radians(@lat)) * sin(radians([l].[Latitude]))))
		FROM [dbo].[Locations] AS l
		INNER JOIN [dbo].[LocationTypes] AS lt ON [l].[LocationTypeId] = [lt].[Id]
		INNER JOIN [dbo].[States] AS s ON [l].[StateId] = [s].[Id]
		INNER JOIN [dbo].[HorseProfiles] AS h ON [h].[LocationId] = [l].[id]
		INNER JOIN [dbo].[Users] AS u ON [u].[Id] = [h].[CreatedBy]
		INNER JOIN [dbo].[Appointments] AS a ON [a].ClientId = u.Id
		INNER JOIN [dbo].[BreedTypes] AS b ON [b].Id = [h].[BreedTypeId]
		WHERE a.CreatedBy = @UserId
			AND h.Id = a.PatientId
		)
		,filteredRecords
	AS (
		SELECT DISTINCT *
		FROM AllRecords
		)
	SELECT DISTINCT filteredRecords.LocationId
		,filteredRecords.LocationTypeId
		,filteredRecords.LocationTypeName
		,filteredRecords.LineOne
		,filteredRecords.LineTwo
		,filteredRecords.City
		,filteredRecords.Zip
		,filteredRecords.StateId
		,filteredRecords.StateName
		,filteredRecords.Latitude
		,filteredRecords.Longitude
		,filteredRecords.DateCreated
		,filteredRecords.DateModified
		,filteredRecords.CreatedBy
		,filteredRecords.ModifiedBy
		,filteredRecords.PatientName
		,filteredRecords.PatientId
		,filteredRecords.PatientAge
		,filteredRecords.PatientIsFemale
		,filteredRecords.PatientColor
		,filteredRecords.PatientWeight
		,filteredRecords.PatientPrimaryImageUrl
		,filteredRecords.PatientHasConsent
		,filteredRecords.PatientBreedTypeId
		,filteredRecords.PatientBreedName
		,filteredRecords.OwnerId
		,filteredRecords.OwnerEmail
		,filteredRecords.OwnerTitle
		,filteredRecords.OwnerFirstName
		,filteredRecords.OwnerLastName
		,filteredRecords.OwnerMiddleInitial
		,filteredRecords.OwnerAvatarUrl
		,filteredRecords.OwnerIsConfirmed
		,filteredRecords.OwnerStatusTypeId
		,filteredRecords.OwnerDateCreated
		,filteredRecords.OwnerDateModified
		,filteredRecords.Users
		,filteredRecords.Medications
		,filteredRecords.Files
		,distance
		,TotalCount = COUNT(1) OVER ()
	FROM filteredRecords
	ORDER BY distance ASC OFFSET @offset ROWS

	FETCH NEXT @PageSize ROWS ONLY;
END
