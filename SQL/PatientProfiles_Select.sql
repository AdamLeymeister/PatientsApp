USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[HorseProfiles_SelectByOwnerId]    Script Date: 11/9/2022 3:08:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=========================================
--Author: Adam Leymeister
--Date Created: October, 2022
--Description: Proc for selecting horse profiles that a given user has
--Code Reviewer:

--=========================================

ALTER proc [dbo].[HorseProfiles_SelectByOwnerId] 
				 @PageIndex int
				,@PageSize int
				,@OwnerId int

as
/*----Test Code----
Declare @PageIndex int = 0,
		@PageSize int = 20,
		@OwnerId INT = 74
Execute dbo.HorseProfiles_SelectByOwnerId
							@PageIndex
							,@PageSize
							,@OwnerId
*/
BEGIN
DECLARE @offset INT = @PageIndex * @PageSize

	SELECT hp.Id
		,hp.[Name]
		,hp.Age
		,hp.isFemale
		,hp.Color
		,hp.[Weight]
		,hp.PrimaryImageUrl
		,hp.HasConsent
		,hp.DateModified
		,bt.Id AS BreedTypeId
		,bt.[Name] AS BreedName
		,[l].Id AS LocationId
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
		,u.Id AS OwnerId
		,[u].[Email] AS OwnerEmail
		,[u].[Title] AS OwnerTitle
		,[u].[FirstName] AS OwnerFirstName
		,[u].[LastName] AS OwnerLastName
		,[u].Mi AS OwnerMiddleInitial
		,[u].[AvatarUrl] AS OwnerAvatarUrl
		,u.IsConfirmed as OwnerIsConfirmed
		,u.StatusTypeId as OwnerStatusTypeId
		,u.DateCreated as OwnerDateCreated
		,u.DateModified as OwnerDateModified
		,Users = (
			SELECT u.FirstName
				,u.LastName
				,u.AvatarUrl
				,u.Email
			FROM dbo.[Users] usr
			INNER JOIN dbo.UserHorses uh ON uh.UserId = usr.Id
			WHERE uh.HorseProfileId = hp.Id
			FOR JSON AUTO
			)
		,Medications = (
			SELECT m.Name
				,m.Manufacturer
				,hm.Dosage
				,hm.DosageUnit
				,hm.NumberDoses
				,hm.Frequency
			FROM dbo.Medications m
			INNER JOIN dbo.HorseMedications hm ON hm.MedicationId = m.Id
			WHERE hm.HorseProfileId = hp.Id
			FOR JSON PATH
			)
		,Files = (
			SELECT f.[Name]
				,f.[Name]
				,f.[Url]
			FROM dbo.Files f
			INNER JOIN dbo.HorseFiles hf ON hf.FileId = f.Id
			WHERE hf.HorseProfileId = hp.Id
			FOR JSON AUTO
			)
		,TotalCount = COUNT(1) OVER ()
	FROM dbo.HorseProfiles hp
	INNER JOIN dbo.Locations l ON l.Id = hp.LocationId
	INNER JOIN dbo.States s ON s.Id = l.StateId
	INNER JOIN dbo.LocationTypes lt ON lt.Id = l.LocationTypeId
	INNER JOIN dbo.BreedTypes bt ON bt.Id = hp.BreedTypeId
	INNER JOIN dbo.Users u ON u.Id = hp.CreatedBy
	WHERE u.Id = @OwnerId
	ORDER BY hp.[Id] DESC OFFSET @offset ROWS

END


