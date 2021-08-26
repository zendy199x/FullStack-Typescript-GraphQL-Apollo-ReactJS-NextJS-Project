import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { CreatePostInput } from "../types/CreatePostInput";
import { PostMutationResponse } from "../types/PostMutationResponse";

@Resolver()
export class PostResolver {
  @Mutation((_return) => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") { title, text }: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title,
        text,
      });

      await newPost.save();

      return {
        code: 200,
        success: true,
        message: "Post created successfully",
        post: newPost,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Query((_return) => [Post])
  async ports(): Promise<Post[]> {
    return Post.find();
  }

  @Query((_return) => Post, { nullable: true })
  async post(@Arg("id", (_type) => ID) id: number): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    return post;
  }
}
